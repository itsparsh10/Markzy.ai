const { getSupabase } = require('../supabaseClient');

function toDoc(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    toolName: row.tool_name,
    description: row.description,
    category: row.category,
    useCase: row.use_case,
    priority: row.priority,
    status: row.status,
    adminNotes: row.admin_notes,
    adminId: row.admin_id,
    reviewedAt: row.reviewed_at ? new Date(row.reviewed_at) : null,
    implementedAt: row.implemented_at ? new Date(row.implemented_at) : null,
    createdAt: row.created_at ? new Date(row.created_at) : null,
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  };
}

async function find(query = {}) {
  const sb = getSupabase();
  let q = sb.from('tool_suggestions').select('*');
  if (query.userId) q = q.eq('user_id', query.userId);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toDoc);
}

async function create(data) {
  const sb = getSupabase();
  const row = {
    user_id: data.userId,
    user_name: data.userName,
    user_email: data.userEmail,
    tool_name: data.toolName,
    description: data.description,
    category: data.category,
    use_case: data.useCase,
    priority: data.priority || 'medium',
    status: data.status || 'pending',
    admin_notes: data.adminNotes,
    admin_id: data.adminId,
    reviewed_at: data.reviewedAt,
    implemented_at: data.implementedAt,
  };
  const { data: inserted, error } = await sb.from('tool_suggestions').insert(row).select('*').single();
  if (error) throw error;
  return toDoc(inserted);
}

const ToolSuggestion = { find, create };

module.exports = ToolSuggestion;
