const { getSupabase } = require('../services/supabaseClient.js');

async function getDatabaseStats() {
  const sb = getSupabase();
  const tables = [
    'users',
    'subscriptions',
    'tool_histories',
    'payment_histories',
    'session_logs',
    'user_analytics',
    'help_tickets',
    'ratings',
    'tool_suggestions',
    'form_queries',
  ];
  const stats = {};
  for (const t of tables) {
    const { count, error } = await sb.from(t).select('*', { count: 'exact', head: true });
    stats[t] = error ? -1 : count ?? 0;
  }
  return stats;
}

async function ping() {
  const sb = getSupabase();
  const { error } = await sb.from('users').select('id', { head: true, count: 'exact' });
  return !error;
}

module.exports = { getDatabaseStats, ping };
