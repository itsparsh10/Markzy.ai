const { getSupabase } = require('../supabaseClient');

function toSub(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    subscriptionId: row.subscription_id,
    userId: row.user_id,
    amount: row.amount,
    currency: row.currency,
    subscriptionName: row.subscription_name,
    type: row.type,
    duration: row.duration,
    status: row.status,
    createdAt: row.created_at ? new Date(row.created_at) : null,
    expiresAt: row.expires_at ? new Date(row.expires_at) : null,
    stripeSessionId: row.stripe_session_id,
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    metadata: row.metadata || {},
    details: row.details,
    numberOfUsers: row.number_of_users,
    createdDate: row.created_date ? new Date(row.created_date) : null,
  };
}

function toRow(data) {
  return {
    subscription_id: data.subscriptionId,
    user_id: data.userId,
    amount: data.amount,
    currency: data.currency || 'USD',
    subscription_name: data.subscriptionName,
    type: data.type,
    duration: data.duration,
    status: data.status || 'active',
    created_at: data.createdAt ? new Date(data.createdAt).toISOString() : undefined,
    expires_at: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
    stripe_session_id: data.stripeSessionId,
    stripe_customer_id: data.stripeCustomerId,
    stripe_subscription_id: data.stripeSubscriptionId,
    metadata: data.metadata || {},
    details: data.details,
    number_of_users: data.numberOfUsers ?? 1,
    created_date: data.createdDate ? new Date(data.createdDate).toISOString() : undefined,
  };
}

async function findById(id) {
  const sb = getSupabase();
  const { data, error } = await sb.from('subscriptions').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return toSub(data);
}

async function findOne(query) {
  const sb = getSupabase();
  let q = sb.from('subscriptions').select('*');
  if (query.subscriptionId) q = q.eq('subscription_id', query.subscriptionId);
  if (query.userId) q = q.eq('user_id', query.userId);
  if (query.status) q = q.eq('status', query.status);
  const { data, error } = await q.order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return toSub(data);
}

/** Latest active subscription for a user (replaces findOne({userId,status}).sort({createdAt:-1})) */
async function findOneActiveByUser(userId) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return toSub(data);
}

async function find(query = {}) {
  const sb = getSupabase();
  let q = sb.from('subscriptions').select('*');
  if (query.userId) q = q.eq('user_id', query.userId);
  if (query.status) q = q.eq('status', query.status);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toSub);
}

async function findByIdAndUpdate(id, update) {
  const sb = getSupabase();
  const patch = subscriptionUpdateToPatch(update);
  const { data, error } = await sb.from('subscriptions').update(patch).eq('id', id).select('*').maybeSingle();
  if (error) throw error;
  return toSub(data);
}

function subscriptionUpdateToPatch(u) {
  const patch = {};
  if (!u) return patch;
  if (u.amount !== undefined) patch.amount = u.amount;
  if (u.status !== undefined) patch.status = u.status;
  if (u.metadata !== undefined) patch.metadata = u.metadata;
  if (u.expiresAt !== undefined) patch.expires_at = u.expiresAt ? new Date(u.expiresAt).toISOString() : null;
  if (u.subscriptionName !== undefined) patch.subscription_name = u.subscriptionName;
  if (u.currency !== undefined) patch.currency = u.currency;
  if (u.type !== undefined) patch.type = u.type;
  if (u.duration !== undefined) patch.duration = u.duration;
  if (u.stripeSessionId !== undefined) patch.stripe_session_id = u.stripeSessionId;
  if (u.stripeCustomerId !== undefined) patch.stripe_customer_id = u.stripeCustomerId;
  if (u.stripeSubscriptionId !== undefined) patch.stripe_subscription_id = u.stripeSubscriptionId;
  if (u.details !== undefined) patch.details = u.details;
  if (u.userId !== undefined) patch.user_id = u.userId;
  if (u.subscriptionId !== undefined) patch.subscription_id = u.subscriptionId;
  return patch;
}

async function findOneAndUpdate(filter, update) {
  const sb = getSupabase();
  const patch = subscriptionUpdateToPatch(update);
  let q = sb.from('subscriptions').update(patch);
  if (filter.stripeCustomerId) q = q.eq('stripe_customer_id', filter.stripeCustomerId);
  if (filter.subscriptionId) q = q.eq('subscription_id', filter.subscriptionId);
  if (filter.userId) q = q.eq('user_id', filter.userId);
  const { data, error } = await q.select('*');
  if (error) throw error;
  if (!data || !data.length) return null;
  return toSub(data[0]);
}

async function findByIdAndDelete(id) {
  const sb = getSupabase();
  const { error } = await sb.from('subscriptions').delete().eq('id', id);
  if (error) throw error;
}

async function create(data) {
  const sb = getSupabase();
  const row = toRow(data);
  const { data: inserted, error } = await sb.from('subscriptions').insert(row).select('*').single();
  if (error) throw error;
  return toSub(inserted);
}

async function countDocuments(filter = {}) {
  const sb = getSupabase();
  let q = sb.from('subscriptions').select('*', { count: 'exact', head: true });
  if (filter.status) q = q.eq('status', filter.status);
  const { count, error } = await q;
  if (error) throw error;
  return count || 0;
}

const Subscription = {
  findById,
  findOne,
  findOneActiveByUser,
  find,
  findByIdAndUpdate,
  findOneAndUpdate,
  findByIdAndDelete,
  create,
  countDocuments,
};

module.exports = Subscription;
