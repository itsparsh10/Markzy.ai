const { getSupabase } = require('../supabaseClient');

function toDoc(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    industry: row.industry,
    message: row.message,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at ? new Date(row.created_at) : null,
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
    assignedTo: row.assigned_to,
    response: row.response,
    tags: row.tags || [],
    source: row.source,
  };
}

class FormQuery {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const sb = getSupabase();
    const row = {
      name: this.name,
      email: this.email,
      company: this.company || '',
      industry: this.industry || '',
      message: this.message || '',
      status: this.status || 'new',
      priority: this.priority || 'medium',
      source: this.source || 'landing-page',
    };
    const { data, error } = await sb.from('form_queries').insert(row).select('*').single();
    if (error) throw error;
    Object.assign(this, toDoc(data));
    this._id = data.id;
    return this;
  }
}

FormQuery.find = async function (query = {}) {
  const sb = getSupabase();
  let q = sb.from('form_queries').select('*');
  if (query.status) q = q.eq('status', query.status);
  if (query.priority) q = q.eq('priority', query.priority);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toDoc);
};

FormQuery.countDocuments = async function (query = {}) {
  const sb = getSupabase();
  let q = sb.from('form_queries').select('*', { count: 'exact', head: true });
  if (query.status) q = q.eq('status', query.status);
  if (query.priority) q = q.eq('priority', query.priority);
  const { count, error } = await q;
  if (error) throw error;
  return count || 0;
};

module.exports = FormQuery;
