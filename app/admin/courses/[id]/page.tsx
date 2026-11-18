import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCourse, updateCourse, deleteCourse, listCategories } from '@/lib/courses';

export const dynamic = 'force-dynamic';

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-heading font-bold">Edit Course</h1>
          <p className="text-muted-foreground mb-6">
            Supabase is not configured yet.
          </p>
        </div>
      </div>
    );
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { id } = await params;
  const [course, categories] = await Promise.all([
    getCourse(id),
    listCategories(),
  ]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-heading font-bold">Edit Course</h1>
          <a
            href="/admin"
            className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          >
            ← Back to dashboard
          </a>
        </div>

        <div className="rounded-xl border bg-card shadow-sm p-6">
          <form action="/api/admin/courses" method="POST" className="space-y-5">
            <input type="hidden" name="_method" value="PUT" />
            <input type="hidden" name="id" value={course.id} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Title *</label>
                <input
                  type="text"
                  required
                  name="title"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue={course.title}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  name="category_id"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} selected={c.id === course.category_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <input
                  type="text"
                  name="price"
                  placeholder="e.g. ₹20,000"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue={course.price ?? ''}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sales Page URL</label>
                <input
                  type="url"
                  name="sales_page_url"
                  placeholder="https://example.com/sales"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue={course.sales_page_url ?? ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={4}
                name="description"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >{course.description ?? ''}</textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content / Details</label>
              <textarea
                rows={6}
                name="content"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >{course.content ?? ''}</textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <input
                  type="number"
                  name="sort_order"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue={course.sort_order}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Course (optional)</label>
                <select
                  name="parent_course_id"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">None (standalone course)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} selected={c.id === course.parent_course_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                Save Changes
              </button>
              <form action={`/api/admin/courses?id=${course.id}`} method="POST" onSubmit={(e) => {
                e.preventDefault();
                if (confirm('Delete this course?')) {
                  fetch(`/api/admin/courses?id=${course.id}`, { method: 'DELETE' }).then(() => {
                    window.location.href = '/admin';
                  });
                }
              }}>
                <button
                  type="submit"
                  className="rounded-lg border bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                >
                  Delete
                </button>
              </form>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
