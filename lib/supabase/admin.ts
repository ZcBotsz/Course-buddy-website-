import { createClient } from '@supabase/supabase-js';

let _admin: any = null;

export function getSupabaseAdmin() {
  if (_admin) return _admin;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local / Vercel env vars for the /admin panel.'
    );
  }

  _admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _admin;
}
