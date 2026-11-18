import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  if (!supabase) {
    // Not configured yet — show a minimal layout
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-heading font-bold">Course Buddy Admin</h1>
          <p className="text-muted-foreground mb-6">
            Supabase is not configured yet. Set your env vars in Vercel.
          </p>
        </div>
      </div>
    );
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/40">
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
