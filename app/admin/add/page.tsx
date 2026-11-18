'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Category = { id: string; name: string; slug: string };

export default function AddCoursePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const supabase = createClient();

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-md bg-card rounded-xl border shadow-sm p-8">
          <h1 className="text-2xl font-heading font-bold">Add Course</h1>
          <p className="text-muted-foreground mb-6">
            Supabase is not configured yet.
          </p>
          <div className="bg-muted p-4 rounded text-sm text-muted-foreground">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
            <code className="font-mono">.env.local</code> (or Vercel env vars),
            then redeploy.
          </div>
        </div>
      </div>
    );
  }

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    sales_page_url: '',
    category_id: '',
    parent_course_id: '',
    sort_order: '0',
    content: '',
    file: null as File | null,
  });

  async function loadCategories() {
    const { data, error } = await supabase!
      .from('categories')
      .select('id, name, slug')
      .order('sort_order', { ascending: true });
    if (!error && data) setCategories(data as Category[]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    let thumbnailUrl: string | null = null;

    // Upload image if provided
    if (form.file) {
      try {
        const formData = new FormData();
        formData.append('file', form.file);
        const res = await fetch('/api/admin/upload', {
          headers: {
            // Send the Supabase auth cookie along
          },
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Upload failed');
        thumbnailUrl = json.url;
      } catch (err: any) {
        setSaving(false);
        setError(err.message || 'Image upload failed');
        return;
      }
    }

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          thumbnail_url: thumbnailUrl,
          price: form.price || null,
          sales_page_url: form.sales_page_url || null,
          category_id: form.category_id,
          parent_course_id: form.parent_course_id || null,
          sort_order: parseInt(form.sort_order) || 0,
          content: form.content || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create course');

      setSuccess('Course added successfully!');
      setForm({
        title: '', description: '', price: '', sales_page_url: '',
        category_id: '', parent_course_id: '', sort_order: '0', content: '',
        file: null,
      });
      setTimeout(() => router.push('/admin'), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to create course');
    } finally {
      setSaving(false);
    }
  }

  if (categories.length === 0) {
    loadCategories();
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-heading font-bold">Add Course</h1>
          <a
            href="/admin"
            className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          >
            ← Back to dashboard
          </a>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-destructive text-destructive-foreground text-sm border border-destructive/30">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-900 text-sm border border-green-200">
            {success}
          </div>
        )}

        <div className="rounded-xl border bg-card shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Title *</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <input
                  type="text"
                  placeholder="e.g. ₹20,000"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sales Page URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/sales"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.sales_page_url}
                  onChange={(e) =>
                    setForm({ ...form, sales_page_url: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={4}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Course Photo</label>
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                onChange={(e) =>
                  setForm({ ...form, file: e.target.files?.[0] ?? null })
                }
              />
              <p className="text-xs text-muted-foreground">
                JPG, PNG, or WebP. Max 25 MB.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <input
                  type="number"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Course (optional)</label>
                <select
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.parent_course_id}
                  onChange={(e) =>
                    setForm({ ...form, parent_course_id: e.target.value })
                  }
                >
                  <option value="">None (standalone course)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content / Details</label>
              <textarea
                rows={6}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full disabled:opacity-50 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              {saving ? 'Saving…' : 'Add Course'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
