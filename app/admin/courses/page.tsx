'use client';

import { createClient } from '@/lib/supabase/client';
import { Search, Plus, Trash2, Edit3, Play, Filter, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CoursesPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [supabaseReady, setSupabaseReady] = useState<boolean | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      // Check if Supabase is configured
      if (!supabase) {
        setSupabaseReady(false);
        setError('Supabase is not configured. Please add your Supabase env vars to Vercel to use the admin panel.');
        setLoading(false);
        return;
      }
      setSupabaseReady(true);

      const [cRes, catsRes] = await Promise.all([
        fetch('/api/admin/courses'),
        supabase.from('categories').select('id, name, slug').order('sort_order', { ascending: true }),
      ]);

      if (!cRes.ok) {
        const errData = await cRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to load courses');
      }

      const cData = await cRes.json();
      setCourses(cData.courses || []);

      if (catsRes.data) {
        setCategories(catsRes.data as any[]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
      setSupabaseReady(false);
    } finally {
      setLoading(false);
    }
  }

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !categoryFilter || c.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this course? This cannot be undone.')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete course');
      }
      setCourses(courses.filter((c) => c.id !== id));
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
    } finally {
      setDeletingId(null);
    }
  }

  if (!supabaseReady) {
    return (
      <div className="min-h-screen bg-background p-6 sm:p-8">
        <div className="max-w-2xl mx-auto rounded-2xl bg-card p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Supabase Not Configured</h1>
          <p className="text-slate-500 mb-6">
            The admin panel needs Supabase to store courses. To get it working:
          </p>
          <div className="text-left mb-6">
            <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
              <li>Add your Supabase env vars in Vercel (Settings → Environment Variables)</li>
              <li>Run the SQL migration in Supabase SQL Editor</li>
              <li>Create an admin user in Supabase → Authentication → Users</li>
              <li>Redeploy your project</li>
            </ol>
          </div>
          <button
            onClick={loadData}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Retry After Configuring
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-slate-500 text-sm">Loading courses…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Courses</h1>
          <p className="text-slate-500 mt-1">
            Manage your course catalog. {filteredCourses.length} of {courses.length} courses.
          </p>
        </div>
        <a
          href="/admin/courses/add"
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 hover:shadow-emerald-500/40 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Course
        </a>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
          <Trash2 className="w-4 h-4" />
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-auto text-destructive hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="flex-1"></div>
          <button
            onClick={loadData}
            className="rounded-lg border px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* Course Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Thumbnail</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                        <Search className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500">No courses found</p>
                      {filteredCourses.length === 0 && courses.length > 0 ? (
                        <p className="text-xs text-slate-400">Try adjusting your search or filter.</p>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{course.title}</div>
                      {course.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {course.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-500">
                        {categories.find((c) => c.id === course.category_id)?.name ||
                          course.category_id ||
                          '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">
                        {course.price || 'Price on request'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/courses/${course.id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </a>
                        <button
                          onClick={(e) => handleDelete(course.id, e)}
                          disabled={deletingId === course.id}
                          className="p-2 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === course.id ? (
                            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCourses.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>{filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} displayed</p>
        </div>
      )}
    </div>
  );
}
