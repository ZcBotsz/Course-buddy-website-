import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { listCourses, listCategories } from '@/lib/courses';
import { Play, User, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="min-h-screen bg-background p-6 sm:p-8">
        <div className="max-w-2xl mx-auto rounded-2xl bg-card p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Course Buddy Admin</h1>
          <p className="text-slate-500 mb-6">Supabase is not configured yet.</p>
          <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground space-y-2">
            <p>Set these in Vercel Settings → Environment Variables:</p>
            <ul className="list-disc list-inside text-xs font-mono space-y-1">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>SUPABASE_URL</li>
              <li>SUPABASE_SERVICE_ROLE_KEY</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Retry After Configuring
          </button>
        </div>
      </div>
    );
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const [courses, categories] = await Promise.all([
    listCourses().catch(() => [] as any[]),
    listCategories().catch(() => [] as any[]),
  ]);

  const publishedCount = courses.filter((c: any) => c.thumbnail_url).length;
  const draftCount = courses.filter((c: any) => !c.thumbnail_url).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {user.email?.split('@')[0] || 'Admin'}. Manage your Course Buddy catalog.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> Visit Site
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={courses.length}
          icon={<Play className="w-5 h-5" />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          trend="Full catalog"
        />
        <StatCard
          title="Categories"
          value={categories.length}
          icon={<User className="w-5 h-5" />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          trend="Organized groups"
        />
        <StatCard
          title="Published"
          value={publishedCount}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend="Live on site"
        />
        <StatCard
          title="Drafts"
          value={draftCount}
          icon={<Play className="w-5 h-5" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          trend="Needs photos"
        />
      </div>

      {/* Recent courses */}
      <div className="rounded-2xl bg-card border shadow-sm overflow-hidden">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-heading font-semibold text-slate-900">Recent Courses</h2>
        </div>
        {courses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No courses yet</h3>
            <p className="text-slate-500 mt-2">Add your first course to get started.</p>
            <a
              href="/admin/courses/add"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Course
            </a>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {courses.slice(0, 6).map((course: any) => (
              <div key={course.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Play className="w-6 h-6 text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{course.title}</p>
                  <p className="text-xs text-slate-500">
                    {course.category_id || 'No category'}
                  </p>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                  {course.price || 'Price on request'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          title="Add New Course"
          description="Upload a photo, set details, and publish"
          icon={<Plus className="w-5 h-5" />}
          href="/admin/courses/add"
          color="from-emerald-500 to-teal-600"
        />
        <ActionCard
          title="Manage Courses"
          description="Edit, delete, or organize your catalog"
          icon={<Play className="w-5 h-5" />}
          href="/admin/courses"
          color="from-blue-500 to-indigo-600"
        />
        <ActionCard
          title="Categories"
          description="Organize your courses into groups"
          icon={<CheckCircle2 className="w-5 h-5" />}
          href="/admin/categories"
          color="from-purple-500 to-pink-600"
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend: string;
}) {
  return (
    <div className={iconBg + ' rounded-2xl p-5 border border-slate-100 shadow-sm'}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
          {icon}
        </div>
        <div className={iconColor + ' text-sm font-medium'}>
          {trend ? <span className="flex items-center gap-1 text-xs">{trend}</span> : null}
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-3xl font-heading font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ActionCard({
  title,
  description,
  icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-2xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 bg-gradient-to-br {color} shadow-lg shadow-lg/40">
        {icon}
      </div>
      <h3 className="font-heading font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </a>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
