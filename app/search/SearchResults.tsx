'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { searchAll } from '@/lib/data';
import { CourseCatalog } from '../components/CourseCatalog';
import { GlobalSearchBar } from '../components/GlobalSearchBar';
export function SearchResults() {
  const params = useSearchParams(); const q = params.get('q') ?? '';
  const results = useMemo(() => searchAll(q), [q]);
  const [limit, setLimit] = useState(60);
  // Reset pagination whenever the query changes.
  useEffect(() => { setLimit(60); }, [q]);
  const visible = results.courses.slice(0, limit);
  return <div className="mx-auto max-w-3xl lg:max-w-none"><GlobalSearchBar /><h1 className="mt-6 font-display text-3xl text-foreground">Search results for “{q}”</h1>
    {results.categories.length ? <section className="mt-6"><p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Categories</p><div className="flex flex-wrap gap-2">{results.categories.map(c => <Link key={c.id} href={`/category/${c.slug}`} className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:border-gold">{c.name} <span className="text-muted">{c.count}</span></Link>)}</div></section> : null}
    <section className="mt-6"><p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Courses</p><p className="mb-4 text-sm text-muted">{results.courses.length} courses</p><CourseCatalog courses={visible} emptyTitle="No courses found" emptyDescription="Try a different search term." />{results.courses.length > limit ? <div className="mt-6 text-center"><button type="button" onClick={() => setLimit(l => l + 60)} className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#fff]">Load more</button></div> : null}</section>
  </div>;
}
