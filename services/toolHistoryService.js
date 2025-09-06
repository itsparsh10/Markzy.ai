const mongoose = require('mongoose');
const ToolHistory = require('./models/ToolHistory.js');
const dbConnect = require('./db.js');

/**
 * Tool History Service
 * Handles storing and retrieving tool generation history in MongoDB
 */
class ToolHistoryService {
  constructor() {
    this.connectionPromise = null;
    this.initConnection();
  }

  /**
   * Initialize database connection once
   */
  async initConnection() {
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = dbConnect()
      .then(() => {
        console.log('✅ ToolHistoryService: Database connected');
      })
      .catch((error) => {
        console.error('❌ ToolHistoryService: Database connection failed:', error);
        this.connectionPromise = null;
      });

    return this.connectionPromise;
  }

  /**
   * Store tool generation result in MongoDB
   */
  async storeToolResult({ userId, toolName, toolId, outputResult }) {
    try {
      if (!userId || !toolName || !toolId || !outputResult) {
        throw new Error('Missing required parameters: userId, toolName, toolId, outputResult');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format. Must be a valid MongoDB ObjectId');
      }

      if (typeof outputResult !== 'object' || outputResult === null) {
        throw new Error('outputResult must be a valid object');
      }

      await this.initConnection();

      const newToolHistory = new ToolHistory({
        userId: new mongoose.Types.ObjectId(userId),
        toolName,
        toolId,
        outputResult,
        generatedDate: new Date()
      });

      const saved = await newToolHistory.save();

      return {
        success: true,
        data: saved,
        message: `Tool result stored successfully for ${toolName}`,
        historyId: saved._id
      };
    } catch (error) {
      console.error('❌ Failed to store tool result:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  /**
   * Get user's tool history
   */
  async getUserToolHistory(userId, options = {}) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
      }

      await this.initConnection();

      const { limit = 50, skip = 0, toolId = null, sortBy = 'generatedDate', sortOrder = 'desc' } = options;

      const query = { userId: new mongoose.Types.ObjectId(userId) };
      if (toolId) query.toolId = toolId;

      const history = await ToolHistory.find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return {
        success: true,
        data: history,
        count: history.length,
        message: `Retrieved ${history.length} tool history records`
      };
    } catch (error) {
      console.error('❌ Failed to fetch tool history:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * Get a specific tool history record by ID
   */
  async getToolHistoryById(historyId, userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(historyId) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid historyId or userId format');
      }

      await this.initConnection();

      const history = await ToolHistory.findOne({
        _id: new mongoose.Types.ObjectId(historyId),
        userId: new mongoose.Types.ObjectId(userId)
      }).lean();

      if (!history) {
        return {
          success: false,
          error: 'Tool history record not found or unauthorized',
          data: null
        };
      }

      return { success: true, data: history, message: 'Tool history record retrieved successfully' };
    } catch (error) {
      console.error('❌ Failed to fetch tool history by ID:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  /**
   * Delete a tool history record
   */
  async deleteToolHistory(historyId, userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(historyId) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid historyId or userId format');
      }

      await this.initConnection();

      const deleted = await ToolHistory.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(historyId),
        userId: new mongoose.Types.ObjectId(userId)
      });

      if (!deleted) {
        return { success: false, error: 'History record not found or unauthorized' };
      }

      return {
        success: true,
        message: 'Tool history deleted successfully',
        deletedRecord: deleted
      };
    } catch (error) {
      console.error('❌ Failed to delete tool history:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get aggregated tool usage statistics
   */
  async getToolUsageStats(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
      }

      await this.initConnection();

      const stats = await ToolHistory.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$toolId',
            toolName: { $first: '$toolName' },
            count: { $sum: 1 },
            lastUsed: { $max: '$generatedDate' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return {
        success: true,
        data: stats,
        message: `Retrieved usage statistics for ${stats.length} tools`
      };
    } catch (error) {
      console.error('❌ Failed to fetch tool usage stats:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * Clear all history records for a user
   */
  async clearUserToolHistory(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
      }

      await this.initConnection();

      const result = await ToolHistory.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });

      return {
        success: true,
        message: `Cleared ${result.deletedCount} tool history records`,
        deletedCount: result.deletedCount
      };
    } catch (error) {
      console.error('❌ Failed to clear tool history:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get recent tool history (last X hours)
   */
  async getRecentToolHistory(userId, hours = 24) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
      }

      await this.initConnection();

      const dateThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);

      const history = await ToolHistory.find({
        userId: new mongoose.Types.ObjectId(userId),
        generatedDate: { $gte: dateThreshold }
      }).sort({ generatedDate: -1 }).lean();

      return {
        success: true,
        data: history,
        count: history.length,
        message: `Retrieved ${history.length} recent tool history records`
      };
    } catch (error) {
      console.error('❌ Failed to fetch recent tool history:', error);
      return { success: false, error: error.message, data: [] };
    }
  }
}

// Singleton export
module.exports = new ToolHistoryService();
