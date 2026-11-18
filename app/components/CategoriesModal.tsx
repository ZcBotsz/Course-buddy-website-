'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { categories } from '@/lib/data';
import { useCategories } from './CategoriesProvider';

export function CategoriesModal() {
  const { open, setOpen } = useCategories();
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      restoreRef.current?.focus?.();
    };
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Browse categories">
      <div className="cb-modal-backdrop absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div
        className="cb-modal-panel absolute inset-x-0 bottom-0 overflow-y-auto rounded-t-3xl border-t border-border bg-surface p-4"
        style={{ maxHeight: '85vh', paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Categories</h2>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="rounded-full px-3 py-1 text-sm text-muted hover:text-foreground">Close</button>
        </div>
        <div className="space-y-1">
          {categories.map(c => (
            <Link key={c.id} href={`/category/${c.slug}`} onClick={() => setOpen(false)} className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm text-foreground hover:bg-surface-raised">
              <span className="flex items-center gap-3">
                {c.thumbnail_url ? <img src={c.thumbnail_url} alt="" className="h-9 w-9 rounded-lg object-cover" /> : null}
                {c.name}
              </span>
              <span className="rounded-full bg-surface-raised px-2.5 py-0.5 text-xs font-semibold text-muted">{c.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
