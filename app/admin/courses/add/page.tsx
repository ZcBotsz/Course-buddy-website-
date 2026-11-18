'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image, FileText, Play, Camera, CheckCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Category = { id: string; name: string; slug: string };

export default function AddCoursePage() {
  const supabase = createClient();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [supabaseReady, setSupabaseReady] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    sales_page_url: '',
    category_id: '',
    parent_course_id: '',
    sort_order: '0',
    content: '',
    thumbnail_file: null as File | null,
    thumbnail_url: '',
  });

  async function loadCategories() {
    if (!supabase) {
      setSupabaseReady(false);
      return;
    }
    try {
      setSupabaseReady(true);
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      if (data) setCategories(data as Category[]);
    } catch (err: any) {
      setError('Failed to load categories: ' + (err.message || 'Unknown error'));
      setSupabaseReady(false);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('Image must be under 25 MB.');
      return;
    }
    setForm({ ...form, thumbnail_file: file });
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim()) {
      setError('Course title is required.');
      return;
    }

    if (!supabase) {
      setError('Supabase is not configured. Cannot save course.');
      return;
    }

    setSaving(true);

    let thumbnailUrl = form.thumbnail_url;

    // Upload image if a new file was selected
    if (form.thumbnail_file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', form.thumbnail_file);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Upload failed');
        thumbnailUrl = json.url;
      } catch (err: any) {
        setSaving(false);
        setUploading(false);
        setError(err.message || 'Image upload failed');
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || null,
          thumbnail_url: thumbnailUrl || null,
          price: form.price.trim() || null,
          sales_page_url: form.sales_page_url.trim() || null,
          category_id: form.category_id || null,
          parent_course_id: form.parent_course_id || null,
          sort_order: parseInt(form.sort_order) || 0,
          content: form.content.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create course');

      setSuccess('Course created successfully!');
      setForm({
        title: '', description: '', price: '', sales_page_url: '',
        category_id: '', parent_course_id: '', sort_order: '0', content: '',
        thumbnail_file: null, thumbnail_url: '',
      });
      setPreviewUrl(null);
      setTimeout(() => router.push('/admin/courses'), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to create course');
    } finally {
      setSaving(false);
    }
  }

  if (!supabaseReady) {
    return (
      <div className="min-h-screen bg-background p-6 sm:p-8">
        <div className="max-w-md mx-auto rounded-2xl bg-card p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Supabase Not Configured</h1>
          <p className="text-slate-500 mb-6">
            You need to configure Supabase to add courses. Add your env vars to Vercel and redeploy.
          </p>
          <button
            onClick={() => router.push('/admin')}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  loadCategories();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to courses
            </button>
            <h1 className="text-2xl font-heading font-bold text-slate-900">Add Course</h1>
            <p className="text-slate-500 mt-1">
              Add a new course to your Course Buddy catalog.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/admin/courses"
              className="rounded-lg border px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </a>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 p-4 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-lg bg-emerald-50 p-4 border border-emerald-100 text-emerald-700 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-5">
              <h2 className="text-lg font-heading font-semibold text-slate-900 flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-600" /> Course Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Course Title *"
                  required
                  type="text"
                  placeholder="e.g. Ultimate Guitar Masterclass"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <Field
                  label="Category"
                  type="select"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Field>
                <Field
                  label="Price (optional)"
                  type="text"
                  placeholder="e.g. ₹20,000"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <Field
                  label="Sales Page URL"
                  type="url"
                  placeholder="https://example.com/course"
                  value={form.sales_page_url}
                  onChange={(e) => setForm({ ...form, sales_page_url: e.target.value })}
                />
              </div>

              <Field
                label="Description"
                type="textarea"
                rows={4}
                placeholder="What will students learn in this course?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-5 pt-4 border-t border-slate-100">
              <h2 className="text-lg font-heading font-semibold text-slate-900 flex items-center gap-2">
                <Image className="w-5 h-5 text-emerald-600" /> Course Photo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Upload Image</label>
                  <div
                    className={`relative group rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                      form.thumbnail_file
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                    {form.thumbnail_file && previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                        <button
                          type="button"
                          onClick={() => {
                            setForm({ ...form, thumbnail_file: null });
                            setPreviewUrl(null);
                          }}
                          className="absolute top-2 right-2 rounded-full bg-destructive text-white px-2 py-1 text-xs hover:bg-destructive/90 transition-colors"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">Click to upload course photo</p>
                        <p className="text-xs text-slate-400">JPG, PNG, or WebP (max 25 MB)</p>
                      </>
                    )}
                  </div>
                </div>
                {previewUrl && (
                  <div className="flex flex-col justify-center items-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl border border-slate-200 shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Advanced */}
            <div className="space-y-5 pt-4 border-t border-slate-100">
              <h2 className="text-lg font-heading font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" /> Course Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Parent Course (optional)"
                  type="select"
                  value={form.parent_course_id}
                  onChange={(e) => setForm({ ...form, parent_course_id: e.target.value })}
                >
                  <option value="">None (standalone course)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Field>
                <Field
                  label="Sort Order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                />
              </div>
              <Field
                label="Content / Details"
                type="textarea"
                rows={6}
                placeholder="Add detailed course content, modules, or syllabus here."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            {/* Submit */}
            <div className="pt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 hover:shadow-emerald-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving || uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving…
                  </>
                ) : (
                  'Create Course'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  type,
  placeholder,
  value,
  onChange,
  children,
  rows,
}: {
  label: string;
  required?: boolean;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  children?: React.ReactNode;
  rows?: number;
}) {
  const isSelect = type === 'select';
  const isTextarea = type === 'textarea';
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1 text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-destructive text-xs">*</span>}
      </label>
      {isSelect ? (
        <select
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          value={value}
          onChange={onChange as any}
        >
          {children}
        </select>
      ) : isTextarea ? (
        <textarea
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          placeholder={placeholder}
          value={value}
          onChange={onChange as any}
          rows={rows ?? 4}
        />
      ) : (
        <input
          type={type}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          placeholder={placeholder}
          value={value}
          onChange={onChange as any}
        />
      )}
    </div>
  );
}

function AlertTriangle({ className }: { className?: string }) {
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
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
