'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit3, ArrowLeft, Save, X } from 'lucide-react';

type Category = { id: string; name: string; slug: string; sort_order?: number; count?: number };

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', sort_order: '0', count: '0' });
  const [addForm, setAddForm] = useState({ name: '', slug: '', sort_order: '0', count: '0' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data.categories || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.slug.trim()) {
      setError('Name and slug are required.');
      return;
    }
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addForm.name.trim(),
          slug: addForm.slug.trim(),
          sort_order: parseInt(addForm.sort_order) || 0,
          count: parseInt(addForm.count) || 0,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to add category');
      }
      setShowAddForm(false);
      setAddForm({ name: '', slug: '', sort_order: '0', count: '0' });
      await loadCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to add category');
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name: editForm.name.trim(),
          slug: editForm.slug.trim(),
          sort_order: parseInt(editForm.sort_order) || 0,
          count: parseInt(editForm.count) || 0,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update category');
      }
      setEditingId(null);
      await loadCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await loadCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </button>
          <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-slate-500 mt-1">
            Organize your courses into categories.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 transition-all"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add Category'}
        </button>
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

      {showAddForm && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Technology"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ai-technology"
                  value={addForm.slug}
                  onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Sort Order</label>
                <input
                  type="number"
                  value={addForm.sort_order}
                  onChange={(e) => setAddForm({ ...addForm, sort_order: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Course Count</label>
                <input
                  type="number"
                  value={addForm.count}
                  onChange={(e) => setAddForm({ ...addForm, count: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 transition-colors"
              >
                Add Category
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Sort Order</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Count</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.length === 0 ? (
                <tr key="empty">
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                        <Plus className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500">No categories yet</p>
                      <p className="text-xs text-slate-400">Add your first category above</p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat) =>
                  editingId === cat.id ? (
                    <tr key={cat.id}>
                      <td colSpan={5} className="px-6 py-4">
                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 uppercase">Name</label>
                            <input
                              type="text"
                              required
                              defaultValue={cat.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 uppercase">Slug</label>
                            <input
                              type="text"
                              required
                              defaultValue={cat.slug}
                              onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 uppercase">Sort Order</label>
                            <input
                              type="number"
                              defaultValue={String(cat.sort_order ?? 0)}
                              onChange={(e) => setEditForm({ ...editForm, sort_order: e.target.value })}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 uppercase">Count</label>
                            <input
                              type="number"
                              defaultValue={String(cat.count ?? 0)}
                              onChange={(e) => setEditForm({ ...editForm, count: e.target.value })}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                            >
                              <Save className="w-3 h-3 mr-1" /> Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded-lg border px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              <X className="w-3 h-3 mr-1" /> Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  ) : (
                    <tr key={cat.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{cat.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-slate-500">{cat.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500">{cat.sort_order ?? 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500">{cat.count ?? 0}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditForm({
                                name: cat.name,
                                slug: cat.slug,
                                sort_order: String(cat.sort_order ?? 0),
                                count: String(cat.count ?? 0),
                              });
                              setEditingId(cat.id);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(cat.id, e)}
                            disabled={deletingId === cat.id}
                            className="p-2 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === cat.id ? (
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
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
