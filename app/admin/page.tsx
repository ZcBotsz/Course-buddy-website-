import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { listCourses, listCategories } from '@/lib/courses';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Supabase is not configured yet.
          </p>
          <div className="bg-muted p-4 rounded text-sm text-muted-foreground">
            Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
            SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY in
            <code className="font-mono">.env.local</code> (or Vercel env vars),
            then redeploy.
          </div>
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

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage courses, upload photos, and organize categories.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/admin/add"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              + Add Course
            </a>
            <a
              href="/"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            >
              View Site
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Courses" value={courses.length} icon="📚" />
          <StatCard
            title="Categories"
            value={categories.length}
            icon="🗂️"
          />
          <StatCard title="Published" value={courses.length} icon="✅" />
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="border-b px-4 py-3">
            <h2 className="text-sm font-heading font-semibold">Courses</h2>
          </div>
          {courses.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No courses yet. <a href="/admin/add">Add your first course</a>.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="px-4 py-3 font-medium">Thumbnail</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Created</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt=""
                          className="w-12 h-12 rounded object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xs">
                          –
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {course.title}
                    </td>
                    <td className="px-4 py-3">
                      {course.categories?.name || course.category_id}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {course.price || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(course.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/admin/courses/${course.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number | string; icon: string }) {
  return (
    <div className="rounded-lg bg-card p-4 border">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{title}</div>
    </div>
  );
}
