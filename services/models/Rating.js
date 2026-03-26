const { getSupabase } = require('../supabaseClient');

function toDoc(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    overallRating: row.overall_rating,
    easeOfUse: row.ease_of_use,
    features: row.features,
    support: row.support,
    valueForMoney: row.value_for_money,
    feedback: row.feedback,
    recommendation: row.recommendation,
    adminNotes: row.admin_notes,
    adminId: row.admin_id,
    reviewedAt: row.reviewed_at ? new Date(row.reviewed_at) : null,
    createdAt: row.created_at ? new Date(row.created_at) : null,
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  };
}

async function find(query = {}) {
  const sb = getSupabase();
  let q = sb.from('ratings').select('*');
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
    overall_rating: data.overallRating,
    ease_of_use: data.easeOfUse ?? 0,
    features: data.features ?? 0,
    support: data.support ?? 0,
    value_for_money: data.valueForMoney ?? 0,
    feedback: data.feedback,
    recommendation: data.recommendation !== undefined ? data.recommendation : true,
    admin_notes: data.adminNotes,
    admin_id: data.adminId,
    reviewed_at: data.reviewedAt,
  };
  const { data: inserted, error } = await sb.from('ratings').insert(row).select('*').single();
  if (error) throw error;
  return toDoc(inserted);
}

const Rating = { find, create };

module.exports = Rating;
