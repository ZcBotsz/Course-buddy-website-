'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon } from './Icons';

const RETURN_KEY = 'cb-search-return-to';

export function GlobalSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const isSearch = pathname === '/search';
  const inputRef = useRef<HTMLInputElement>(null);
  const lastUrlQ = useRef<string | null>(null);
  const [value, setValue] = useState(isSearch ? params.get('q') ?? '' : '');

  // Remember where the visitor came from so clearing the search returns them there.
  useEffect(() => {
    if (isSearch) return;
    try {
      sessionStorage.setItem(RETURN_KEY, `${pathname}${window.location.search || ''}`);
    } catch {}
  }, [pathname, isSearch]);

  // Sync the box from the URL on external navigation (back/forward, links),
  // but never clobber what the user is actively typing.
  useEffect(() => {
    if (!isSearch) { lastUrlQ.current = null; return; }
    const urlQ = params.get('q') ?? '';
    if (lastUrlQ.current === urlQ) return;
    lastUrlQ.current = urlQ;
    if (document.activeElement !== inputRef.current) setValue(urlQ);
  }, [isSearch, params]);

  useEffect(() => {
    const q = value.trim();
    if (!q) {
      if (isSearch) {
        let dest = '/';
        try { dest = sessionStorage.getItem(RETURN_KEY) || '/'; } catch {}
        router.replace(dest, { scroll: false });
      }
      return;
    }
    // Skip redundant navigation when the URL already reflects the query.
    if (isSearch && (params.get('q') ?? '') === q) return;
    const t = setTimeout(() => router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false }), 300);
    return () => clearTimeout(t);
  }, [value, isSearch, router, params]);

  return (
    <form
      className="relative w-full max-w-xl"
      role="search"
      onSubmit={e => {
        e.preventDefault();
        const q = value.trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
    >
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/55" />
      <input
        ref={inputRef}
        aria-label="Search everything"
        type="search"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search all categories and courses…"
        className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground shadow-[0_1px_2px_rgba(42,32,24,0.05)] outline-none transition-colors placeholder:text-muted hover:border-gold/40 focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
    </form>
  );
}
