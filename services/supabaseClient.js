const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useServiceRole = process.env.SUPABASE_USE_SERVICE_ROLE === 'true';
const key = useServiceRole && serviceRoleKey ? serviceRoleKey : anonKey;

let client = null;

/**
 * Server-side Supabase client (API routes, services).
 * Prefer SUPABASE_SERVICE_ROLE_KEY in production; anon key works with permissive RLS policies.
 */
function getSupabase() {
  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

module.exports = { getSupabase };
