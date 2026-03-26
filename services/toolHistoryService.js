const ToolHistory = require('./models/ToolHistory.js');
const dbConnect = require('./db.js');
const { getSupabase } = require('./supabaseClient');

function isUuid(s) {
  return (
    typeof s === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)
  );
}

class ToolHistoryService {
  constructor() {
    this.connectionPromise = null;
    this.initConnection();
  }

  async initConnection() {
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = dbConnect()
      .then(() => {
        getSupabase();
      })
      .catch((error) => {
        console.error('❌ ToolHistoryService: Database connection failed:', error);
        this.connectionPromise = null;
      });

    return this.connectionPromise;
  }

  async storeToolResult({ userId, toolName, toolId, outputResult }) {
    try {
      if (!userId || !toolName || !toolId || !outputResult) {
        throw new Error('Missing required parameters: userId, toolName, toolId, outputResult');
      }

      if (!isUuid(String(userId))) {
        throw new Error('Invalid userId format. Must be a valid user UUID');
      }

      if (typeof outputResult !== 'object' || outputResult === null) {
        throw new Error('outputResult must be a valid object');
      }

      await this.initConnection();

      const inst = new ToolHistory({
        userId,
        toolName,
        toolId,
        outputResult,
        generatedDate: new Date(),
      });
      const saved = await inst.save();

      return {
        success: true,
        data: saved,
        message: `Tool result stored successfully for ${toolName}`,
        historyId: saved._id,
      };
    } catch (error) {
      console.error('❌ Failed to store tool result:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  async getUserToolHistory(userId, options = {}) {
    try {
      if (!isUuid(String(userId))) {
        throw new Error('Invalid userId format');
      }

      await this.initConnection();

      const { limit = 50, skip = 0, toolId = null, sortBy = 'generatedDate', sortOrder = 'desc' } = options;

      const sb = getSupabase();
      let q = sb.from('tool_histories').select('*').eq('user_id', userId);
      if (toolId) q = q.eq('tool_id', toolId);
      const ascending = sortOrder !== 'desc';
      const col = sortBy === 'generatedDate' ? 'generated_date' : 'generated_date';
      q = q.order(col, { ascending }).range(skip, skip + limit - 1);

      const { data, error } = await q;
      if (error) throw error;

      const history = (data || []).map((row) => ({
        _id: row.id,
        userId: row.user_id,
        toolName: row.tool_name,
        toolId: row.tool_id,
        outputResult: row.output_result,
        generatedDate: row.generated_date,
      }));

      return {
        success: true,
        data: history,
        count: history.length,
        message: `Retrieved ${history.length} tool history records`,
      };
    } catch (error) {
      console.error('❌ Failed to fetch tool history:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async getToolHistoryById(historyId, userId) {
    try {
      if (!isUuid(String(historyId)) || !isUuid(String(userId))) {
        throw new Error('Invalid historyId or userId format');
      }

      await this.initConnection();

      const sb = getSupabase();
      const { data, error } = await sb
        .from('tool_histories')
        .select('*')
        .eq('id', historyId)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;

      if (!data) {
        return {
          success: false,
          error: 'Tool history record not found or unauthorized',
          data: null,
        };
      }

      const history = {
        _id: data.id,
        userId: data.user_id,
        toolName: data.tool_name,
        toolId: data.tool_id,
        outputResult: data.output_result,
        generatedDate: data.generated_date,
      };

      return { success: true, data: history, message: 'Tool history record retrieved successfully' };
    } catch (error) {
      console.error('❌ Failed to fetch tool history by ID:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  async deleteToolHistory(historyId, userId) {
    try {
      if (!isUuid(String(historyId)) || !isUuid(String(userId))) {
        throw new Error('Invalid historyId or userId format');
      }

      await this.initConnection();

      const deleted = await ToolHistory.findOneAndDelete({
        _id: historyId,
        userId,
      });

      if (!deleted) {
        return { success: false, error: 'History record not found or unauthorized' };
      }

      return {
        success: true,
        message: 'Tool history deleted successfully',
        deletedRecord: deleted,
      };
    } catch (error) {
      console.error('❌ Failed to delete tool history:', error);
      return { success: false, error: error.message };
    }
  }

  async getToolUsageStats(userId) {
    try {
      if (!isUuid(String(userId))) {
        throw new Error('Invalid userId format');
      }

      await this.initConnection();

      const sb = getSupabase();
      const { data, error } = await sb.from('tool_histories').select('tool_id, tool_name, generated_date').eq('user_id', userId);
      if (error) throw error;

      const statsMap = {};
      (data || []).forEach((r) => {
        const tid = r.tool_id || 'unknown';
        if (!statsMap[tid]) {
          statsMap[tid] = {
            _id: tid,
            toolName: r.tool_name,
            count: 0,
            lastUsed: null,
          };
        }
        statsMap[tid].count += 1;
        const d = new Date(r.generated_date);
        if (!statsMap[tid].lastUsed || d > statsMap[tid].lastUsed) statsMap[tid].lastUsed = d;
      });

      const stats = Object.values(statsMap).sort((a, b) => b.count - a.count);

      return {
        success: true,
        data: stats,
        message: `Retrieved usage statistics for ${stats.length} tools`,
      };
    } catch (error) {
      console.error('❌ Failed to fetch tool usage stats:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async clearUserToolHistory(userId) {
    try {
      if (!isUuid(String(userId))) {
        throw new Error('Invalid userId format');
      }

      await this.initConnection();

      const result = await ToolHistory.deleteMany({ userId });

      return {
        success: true,
        message: `Cleared ${result.deletedCount} tool history records`,
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      console.error('❌ Failed to clear tool history:', error);
      return { success: false, error: error.message };
    }
  }

  async getRecentToolHistory(userId, hours = 24) {
    try {
      if (!isUuid(String(userId))) {
        throw new Error('Invalid userId format');
      }

      await this.initConnection();

      const dateThreshold = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      const sb = getSupabase();
      const { data, error } = await sb
        .from('tool_histories')
        .select('*')
        .eq('user_id', userId)
        .gte('generated_date', dateThreshold)
        .order('generated_date', { ascending: false });
      if (error) throw error;

      const history = (data || []).map((row) => ({
        _id: row.id,
        userId: row.user_id,
        toolName: row.tool_name,
        toolId: row.tool_id,
        outputResult: row.output_result,
        generatedDate: row.generated_date,
      }));

      return {
        success: true,
        data: history,
        count: history.length,
        message: `Retrieved ${history.length} recent tool history records`,
      };
    } catch (error) {
      console.error('❌ Failed to fetch recent tool history:', error);
      return { success: false, error: error.message, data: [] };
    }
  }
}

module.exports = new ToolHistoryService();
