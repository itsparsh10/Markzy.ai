const { getSupabase } = require('./supabaseClient');

/**
 * Backwards-compatible hook for routes that await dbConnect().
 * Supabase uses HTTP and does not need a persistent TCP connection like MongoDB.
 */
async function dbConnect() {
  getSupabase();
}

module.exports = dbConnect;
