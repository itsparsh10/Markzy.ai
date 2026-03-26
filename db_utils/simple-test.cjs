/**
 * Quick Supabase connectivity check (replaces MongoDB simple-test).
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function main() {
  console.log('\n🔌 Supabase connection test\n');
  if (!url || !key) {
    console.error('❌ Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
  }
  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await sb.from('users').select('id').limit(1);
  if (error) {
    console.error('❌ Supabase query failed:', error.message);
    console.error('   Run supabase/migrations/001_initial_schema.sql in the Supabase SQL editor if tables are missing.');
    process.exit(1);
  }
  console.log('✅ Connected to Supabase and can query public.users\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
