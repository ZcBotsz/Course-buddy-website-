'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/data';
import { useCategories } from './CategoriesProvider';
import { ChevronRight, GridIcon } from './Icons';
export function CategoryTabs() {
  const pathname = usePathname(); const { setOpen } = useCategories();
  const active = pathname.startsWith('/category/') ? pathname.split('/')[2] : null;
  return <>
    <button type="button" onClick={() => setOpen(true)} className="moving-border flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-foreground shadow-[0_8px_24px_-12px_rgba(99,102,241,0.45)] transition-transform active:scale-[0.98] md:hidden">
      <GridIcon className="h-5 w-5 text-gold-soft" />
      <span className="min-w-0 flex-1"><span className="block text-xs text-muted">{categories.length} categories</span><span className="block truncate font-display text-base font-semibold">Browse Categories</span></span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-soft"><ChevronRight className="h-4 w-4" /></span>
    </button>
    <nav aria-label="Categories" className="hidden w-64 shrink-0 md:block">
      <p className="text-sm font-bold uppercase tracking-wider text-foreground">Categories</p>
      <div className="mt-3 space-y-1">{categories.map(c => <Link key={c.id} href={`/category/${c.slug}`} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${active === c.slug ? 'bg-gold/15 font-semibold text-gold-soft' : 'text-muted hover:bg-surface-raised hover:text-foreground'}`}><span className="truncate">{c.name}</span><span className="shrink-0 rounded-full bg-surface-raised px-2 py-0.5 text-xs font-semibold">{c.count}</span></Link>)}</div>
    </nav>
  </>;
}
