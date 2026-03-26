const { getSupabase } = require('../supabaseClient');

function toDoc(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    toolName: row.tool_name,
    visitCount: row.visit_count,
    startTime: row.start_time ? new Date(row.start_time) : null,
    endTime: row.end_time ? new Date(row.end_time) : null,
    timeSpent: row.time_spent,
    lastVisitDate: row.last_visit_date ? new Date(row.last_visit_date) : null,
  };
}

const UserAnalytics = {
  async aggregate(pipeline) {
    const sb = getSupabase();
    const groupStage = pipeline.find((p) => p.$group);
    if (groupStage && groupStage.$group && groupStage.$group._id === '$toolName') {
      const { data, error } = await sb.from('user_analytics').select('tool_name, visit_count, time_spent, user_id, last_visit_date');
      if (error) throw error;
      const map = {};
      (data || []).forEach((row) => {
        const k = row.tool_name;
        if (!map[k]) {
          map[k] = {
            _id: k,
            totalVisits: 0,
            totalTimeSpent: 0,
            uniqueUsers: new Set(),
            lastVisit: null,
          };
        }
        map[k].totalVisits += row.visit_count || 1;
        map[k].totalTimeSpent += Number(row.time_spent) || 0;
        map[k].uniqueUsers.add(String(row.user_id));
        const lv = row.last_visit_date ? new Date(row.last_visit_date) : null;
        if (lv && (!map[k].lastVisit || lv > map[k].lastVisit)) map[k].lastVisit = lv;
      });
      return Object.values(map).map((m) => ({
        _id: m._id,
        totalVisits: m.totalVisits,
        totalTimeSpent: m.totalTimeSpent,
        uniqueUserCount: m.uniqueUsers.size,
        lastVisit: m.lastVisit,
        averageTimeSpent: m.totalVisits ? m.totalTimeSpent / m.totalVisits : 0,
      })).sort((a, b) => (b.totalVisits - a.totalVisits));
    }
    return [];
  },
};

module.exports = UserAnalytics;
