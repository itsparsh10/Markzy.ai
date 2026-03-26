const { getSupabase } = require('../supabaseClient');

function isUuid(s) {
  return (
    typeof s === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)
  );
}

function toUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    email: row.email,
    password: row.password,
    name: row.name,
    role: row.role,
    Subscription_id: row.subscription_id,
    isActive: row.is_active,
    createdAt: row.created_at ? new Date(row.created_at) : null,
    externalUserId: row.external_user_id,
    additionalData:
      row.additional_data && typeof row.additional_data === 'object'
        ? row.additional_data
        : {},
  };
}

function toRow(data) {
  const row = {
    email: data.email,
    password: data.password,
    name: data.name,
    role: data.role || 'user',
    is_active: data.isActive !== undefined ? data.isActive : true,
    additional_data: data.additionalData || {},
  };
  if (data.subscription_id !== undefined) row.subscription_id = data.subscription_id;
  if (data.Subscription_id !== undefined) row.subscription_id = data.Subscription_id;
  if (data.externalUserId !== undefined) row.external_user_id = data.externalUserId;
  if (data.id) row.id = data.id;
  return row;
}

async function findById(id) {
  if (!id) return null;
  const sb = getSupabase();
  const { data, error } = await sb.from('users').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return toUser(data);
}

async function findOne(query) {
  const sb = getSupabase();
  let q = sb.from('users').select('*');
  if (query.email) q = q.eq('email', String(query.email).toLowerCase());
  if (query.externalUserId !== undefined) q = q.eq('external_user_id', query.externalUserId);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return toUser(data);
}

async function findByIdAndUpdate(id, update, _opts) {
  const sb = getSupabase();
  const patch = {};
  if (update.email !== undefined) patch.email = update.email;
  if (update.password !== undefined) patch.password = update.password;
  if (update.name !== undefined) patch.name = update.name;
  if (update.role !== undefined) patch.role = update.role;
  if (update.isActive !== undefined) patch.is_active = update.isActive;
  if (update.Subscription_id !== undefined) patch.subscription_id = update.Subscription_id;
  if (update.additionalData !== undefined) patch.additional_data = update.additionalData;
  if (update.additional_data !== undefined) patch.additional_data = update.additional_data;
  const { data, error } = await sb.from('users').update(patch).eq('id', id).select('*').maybeSingle();
  if (error) throw error;
  return toUser(data);
}

async function createUser(data) {
  const sb = getSupabase();
  const row = toRow(data);
  if (data._id && isUuid(String(data._id))) row.id = String(data._id);
  if (data.id && isUuid(String(data.id))) row.id = String(data.id);
  const { data: inserted, error } = await sb.from('users').insert(row).select('*').single();
  if (error) throw error;
  return toUser(inserted);
}

async function countDocuments(filter = {}) {
  const sb = getSupabase();
  let q = sb.from('users').select('*', { count: 'exact', head: true });
  if (filter.createdAt && filter.createdAt.$gte) {
    q = q.gte('created_at', filter.createdAt.$gte.toISOString());
  }
  const { count, error } = await q;
  if (error) throw error;
  return count || 0;
}

async function findByIdAndDelete(id) {
  const sb = getSupabase();
  const { error } = await sb.from('users').delete().eq('id', id);
  if (error) throw error;
}

class User {
  constructor(data) {
    Object.assign(this, data);
    if (data.Subscription_id) this.Subscription_id = data.Subscription_id;
    if (data.additionalData) this.additionalData = data.additionalData;
  }
  async save() {
    const created = await createUser({
      email: this.email,
      password: this.password,
      name: this.name,
      role: this.role,
      isActive: this.isActive,
      additionalData: this.additionalData,
      externalUserId: this.externalUserId,
      _id: this._id,
      id: this.id,
    });
    Object.assign(this, created);
    this._id = created._id;
    return this;
  }
}

User.findById = findById;
User.findOne = findOne;
User.findByIdAndUpdate = findByIdAndUpdate;
User.findByIdAndDelete = findByIdAndDelete;
User.create = async (data) => createUser(data);
User.countDocuments = countDocuments;

module.exports = User;
