const { getSupabase } = require('../supabaseClient');

function toDoc(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    subject: row.subject,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    adminResponse: row.admin_response,
    adminId: row.admin_id,
    resolvedAt: row.resolved_at ? new Date(row.resolved_at) : null,
    createdAt: row.created_at ? new Date(row.created_at) : null,
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  };
}

async function find(query = {}) {
  const sb = getSupabase();
  let q = sb.from('help_tickets').select('*');
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
    subject: data.subject,
    description: data.description,
    category: data.category,
    priority: data.priority || 'medium',
    status: data.status || 'open',
    admin_response: data.adminResponse,
    admin_id: data.adminId,
    resolved_at: data.resolvedAt,
    created_at: data.createdAt ? new Date(data.createdAt).toISOString() : undefined,
    updated_at: data.updatedAt ? new Date(data.updatedAt).toISOString() : undefined,
  };
  const { data: inserted, error } = await sb.from('help_tickets').insert(row).select('*').single();
  if (error) throw error;
  return toDoc(inserted);
}

const HelpTicket = { find, create };

module.exports = HelpTicket;
