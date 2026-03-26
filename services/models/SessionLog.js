const { getSupabase } = require('../supabaseClient');

function toLog(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    userId: row.user_id,
    loginAt: row.login_at ? new Date(row.login_at) : null,
    logoutAt: row.logout_at ? new Date(row.logout_at) : null,
    duration: row.duration,
    toolName: row.tool_name,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    isActive: row.is_active,
    createdAt: row.created_at ? new Date(row.created_at) : null,
  };
}

class SessionLog {
  constructor(data) {
    this.userId = data.userId;
    this.loginAt = data.loginAt || new Date();
    this.logoutAt = data.logoutAt;
    this.duration = data.duration ?? 0;
    this.toolName = data.toolName;
    this.ipAddress = data.ipAddress;
    this.userAgent = data.userAgent;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  async save() {
    const sb = getSupabase();
    const row = {
      user_id: this.userId,
      login_at: new Date(this.loginAt).toISOString(),
      logout_at: this.logoutAt ? new Date(this.logoutAt).toISOString() : null,
      duration: this.duration || 0,
      tool_name: this.toolName || null,
      ip_address: this.ipAddress || null,
      user_agent: this.userAgent || null,
      is_active: this.isActive,
    };
    const { data, error } = await sb.from('session_logs').insert(row).select('*').single();
    if (error) throw error;
    Object.assign(this, toLog(data));
    this._id = data.id;
    return this;
  }
}

SessionLog.find = async function (query = {}, options = {}) {
  const sb = getSupabase();
  let q = sb.from('session_logs').select('*');
  if (query.userId) q = q.eq('user_id', query.userId);
  if (query.isActive !== undefined) q = q.eq('is_active', query.isActive);
  const asc = options.sort && options.sort.loginAt === 1;
  q = q.order('login_at', { ascending: asc });
  if (options.limit) q = q.limit(options.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(toLog);
};

SessionLog.findOne = async function (query) {
  const sb = getSupabase();
  let q = sb.from('session_logs').select('*');
  if (query.userId) q = q.eq('user_id', query.userId);
  const { data, error } = await q.order('login_at', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return toLog(data);
};

SessionLog.findOneAndUpdate = async function (filter, update, _opts) {
  const sb = getSupabase();
  const active = filter.isActive !== undefined ? filter.isActive : true;
  let q = sb.from('session_logs').select('*').eq('user_id', filter.userId).eq('is_active', active);
  const { data: rows, error: findErr } = await q.order('login_at', { ascending: false }).limit(1);
  if (findErr) throw findErr;
  if (!rows || !rows.length) return null;
  const row = rows[0];
  const loginAt = new Date(row.login_at);
  const logoutAt = new Date();
  const duration = Math.floor((logoutAt.getTime() - loginAt.getTime()) / 1000);
  const patch = {
    logout_at: logoutAt.toISOString(),
    is_active: false,
    duration,
  };
  const { data: updated, error } = await sb
    .from('session_logs')
    .update(patch)
    .eq('id', row.id)
    .select('*')
    .single();
  if (error) throw error;
  return toLog(updated);
};

SessionLog.updateMany = async function (filter) {
  const sb = getSupabase();
  const cutoff =
    filter && filter.loginAt && filter.loginAt.$lt
      ? new Date(filter.loginAt.$lt).toISOString()
      : new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: oldRows, error: fetchErr } = await sb
    .from('session_logs')
    .select('*')
    .eq('is_active', true)
    .lt('login_at', cutoff);
  if (fetchErr) throw fetchErr;
  let modified = 0;
  for (const row of oldRows || []) {
    const loginAt = new Date(row.login_at);
    const logoutAt = new Date();
    const duration = Math.floor((logoutAt.getTime() - loginAt.getTime()) / 1000);
    const { error } = await sb
      .from('session_logs')
      .update({
        is_active: false,
        logout_at: logoutAt.toISOString(),
        duration,
      })
      .eq('id', row.id);
    if (!error) modified += 1;
  }
  return { modifiedCount: modified };
};

SessionLog.distinct = async function (field, filter = {}) {
  const sb = getSupabase();
  const col = field === 'userId' ? 'user_id' : field;
  let q = sb.from('session_logs').select(col);
  if (filter.loginAt && filter.loginAt.$gte) {
    q = q.gte('login_at', filter.loginAt.$gte.toISOString());
  }
  if (filter.$or) {
    q = q.eq('is_active', true);
  }
  const { data, error } = await q;
  if (error) throw error;
  const set = new Set();
  (data || []).forEach((r) => {
    const v = r[col] || r.user_id;
    if (v) set.add(String(v));
  });
  return [...set];
};

SessionLog.countDocuments = async function (filter = {}) {
  const sb = getSupabase();
  let q = sb.from('session_logs').select('*', { count: 'exact', head: true });
  if (filter.loginAt && filter.loginAt.$gte) {
    q = q.gte('login_at', filter.loginAt.$gte.toISOString());
  }
  const { count, error } = await q;
  if (error) throw error;
  return count || 0;
};

SessionLog.aggregate = async function (pipeline) {
  const sb = getSupabase();
  const match = pipeline[0] && pipeline[0].$match;
  if (match && match.loginAt && match.loginAt.$gte) {
    const { data, error } = await sb
      .from('session_logs')
      .select('login_at, duration, user_id')
      .gte('login_at', match.loginAt.$gte.toISOString());
    if (error) throw error;
    const groupStage = pipeline.find((p) => p.$group);
    if (groupStage && groupStage.$group && groupStage.$group._id && groupStage.$group._id.$dateToString) {
      const buckets = {};
      (data || []).forEach((row) => {
        const d = new Date(row.login_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (!buckets[key]) {
          buckets[key] = {
            _id: key,
            dailySessions: 0,
            dailyDuration: 0,
            uniqueUsers: new Set(),
          };
        }
        buckets[key].dailySessions += 1;
        buckets[key].dailyDuration += Number(row.duration) || 0;
        buckets[key].uniqueUsers.add(String(row.user_id));
      });
      return Object.values(buckets).map((b) => ({
        _id: b._id,
        dailySessions: b.dailySessions,
        dailyDuration: b.dailyDuration,
        dailyUniqueUsers: b.uniqueUsers.size,
      })).sort((a, b) => (a._id < b._id ? -1 : 1));
    }
  }
  return [];
};

module.exports = SessionLog;
