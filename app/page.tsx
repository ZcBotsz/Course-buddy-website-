import { Suspense } from 'react';
import { GlobalSearchBar } from './components/GlobalSearchBar';
import { CategoryTabs } from './components/CategoryTabs';
import { UpdatesFeed } from './components/UpdatesFeed';
import { SITE_NAME } from '@/lib/config';
export default function HomePage() {
  return <div className="mx-auto max-w-3xl lg:max-w-none">
    <h1 className="font-display text-[1.6rem] leading-tight text-foreground sm:text-3xl">Welcome to <span className="whitespace-nowrap text-gold-soft">{SITE_NAME}</span></h1>
    <p className="mt-3 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300 sm:text-base"><span aria-hidden className="relative flex h-2.5 w-2.5 shrink-0"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" /></span><span>Latest courses added</span></p>
    <div className="mt-5"><Suspense fallback={null}><GlobalSearchBar /></Suspense></div>
    <div className="mt-4 flex flex-col gap-6 md:flex-row md:gap-10"><CategoryTabs /><div className="min-w-0 flex-1"><UpdatesFeed /></div></div>
  </div>;
}
