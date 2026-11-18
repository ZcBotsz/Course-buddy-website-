'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-8">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 border border-slate-200 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs tracking-wider">CB</span>
            </div>
            <h1 className="font-heading font-bold text-slate-900 text-xl">Course Buddy</h1>
          </div>
          <h2 className="text-lg font-medium text-slate-900 mb-2">Admin Login</h2>
          <p className="text-muted-foreground mb-6">Supabase is not configured yet.</p>
          <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground space-y-2">
            <p>Set these in Vercel Settings → Environment Variables:</p>
            <ul className="list-disc list-inside text-xs font-mono space-y-1">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>SUPABASE_URL</li>
              <li>SUPABASE_SERVICE_ROLE_KEY</li>
            </ul>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Then create an admin user in Supabase → Authentication → Users.
          </p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!supabase) return;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get('redirect') || '/admin';
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-4 sm:p-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 border border-slate-200 shadow-2xl shadow-emerald-100/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />

        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <span className="text-white font-bold text-xs tracking-wider">CB</span>
          </div>
          <h1 className="font-heading font-bold text-slate-900 text-xl">Course Buddy</h1>
        </div>

        <h2 className="text-lg font-medium text-slate-900 mb-2">Admin Login</h2>
        <p className="text-slate-500 text-sm mb-6">
          Sign in to manage your courses and catalog.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-4 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full disabled:opacity-60 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 hover:shadow-emerald-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in…
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" /> Sign in
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-muted-foreground">
          No account yet? Create one in Supabase → Authentication → Users.
        </p>
      </div>
    </div>
  );
}
