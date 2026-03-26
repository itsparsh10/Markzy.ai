const { getSupabase } = require('../supabaseClient');

function toDoc(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    userId: row.user_id,
    toolName: row.tool_name,
    toolId: row.tool_id,
    outputResult: row.output_result || {},
    prompt: row.prompt,
    generatedDate: row.generated_date ? new Date(row.generated_date) : null,
  };
}

class ToolHistory {
  constructor(data) {
    this.userId = data.userId;
    this.toolName = data.toolName;
    this.toolId = data.toolId;
    this.outputResult = data.outputResult;
    this.prompt = data.prompt;
    this.generatedDate = data.generatedDate || new Date();
  }

  async save() {
    const sb = getSupabase();
    const row = {
      user_id: this.userId,
      tool_name: this.toolName,
      tool_id: this.toolId || this.toolName,
      output_result: this.outputResult || {},
      prompt: this.prompt || null,
      generated_date: new Date(this.generatedDate).toISOString(),
    };
    const { data, error } = await sb.from('tool_histories').insert(row).select('*').single();
    if (error) throw error;
    const doc = toDoc(data);
    Object.assign(this, doc);
    this._id = doc._id;
    return this;
  }
}

ToolHistory.find = async function (query = {}, options = {}) {
  const sb = getSupabase();
  let q = sb.from('tool_histories').select('*');
  if (query.userId) q = q.eq('user_id', query.userId);
  if (query.toolName) q = q.eq('tool_name', query.toolName);
  const asc = options.sort && options.sort.generatedDate === 1;
  q = q.order('generated_date', { ascending: asc });
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(toDoc);
};

ToolHistory.findOne = async function (query) {
  const sb = getSupabase();
  let q = sb.from('tool_histories').select('*');
  if (query._id) q = q.eq('id', query._id);
  if (query.userId) q = q.eq('user_id', query.userId);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return toDoc(data);
};

ToolHistory.findOneAndDelete = async function (query) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('tool_histories')
    .delete()
    .eq('id', query._id)
    .eq('user_id', query.userId)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return toDoc(data);
};

ToolHistory.deleteMany = async function (query) {
  const sb = getSupabase();
  const { error, count } = await sb
    .from('tool_histories')
    .delete({ count: 'exact' })
    .eq('user_id', query.userId);
  if (error) throw error;
  return { deletedCount: count ?? 0 };
};

ToolHistory.aggregate = async function (_pipeline) {
  throw new Error('ToolHistory.aggregate: use Supabase SQL or adminServices helper');
};

ToolHistory.countDocuments = async function (filter = {}) {
  const sb = getSupabase();
  let q = sb.from('tool_histories').select('*', { count: 'exact', head: true });
  if (filter.generatedDate && filter.generatedDate.$gte) {
    q = q.gte('generated_date', filter.generatedDate.$gte.toISOString());
  }
  const { count, error } = await q;
  if (error) throw error;
  return count || 0;
};

module.exports = ToolHistory;
