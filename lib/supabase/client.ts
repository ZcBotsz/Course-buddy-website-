import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During builds (or before env vars are set), return null so the page can
  // still prerender. Components check for null and guide the admin to configure.
  if (!url || !key) return null;

  return createBrowserClient(url, key);
}
