'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-md bg-card rounded-xl border shadow-sm p-8">
          <h1 className="text-2xl font-heading font-bold">Admin Login</h1>
          <p className="text-muted-foreground mb-6">
            Supabase is not configured yet.
          </p>
          <div className="bg-muted p-4 rounded text-sm text-muted-foreground">
            Set these in <code className="font-mono">.env.local</code> (or Vercel
            env vars), then redeploy:
          </div>
          <ul className="text-sm text-muted-foreground mt-3 space-y-1 list-disc list-inside">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>SUPABASE_URL</li>
            <li>SUPABASE_SERVICE_ROLE_KEY</li>
          </ul>
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

    const { error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-md bg-card rounded-xl border shadow-sm p-8">
        <h1 className="text-2xl font-heading font-bold">Admin Login</h1>
        <p className="text-muted-foreground mb-6">
          Sign in to manage courses.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded bg-destructive text-destructive-foreground text-sm border border-destructive/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full disabled:opacity-50 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground text-center">
          No account yet? Create one in the Supabase dashboard under
          Authentication → Users, then sign in here.
        </p>
      </div>
    </div>
  );
}
