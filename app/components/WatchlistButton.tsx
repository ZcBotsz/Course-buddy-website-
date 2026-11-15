'use client';
import { useWatchlist } from './WatchlistProvider';
import { BookmarkIcon } from './Icons';
import type { Course, WatchlistItem } from '@/lib/types';
export function WatchlistButton({ course, variant = 'icon' }: { course: Course | WatchlistItem; variant?: 'icon' | 'full' }) {
  const { isSaved, toggle } = useWatchlist();
  const saved = isSaved(course.id);
  const item: WatchlistItem = { id: course.id, title: course.title, thumbnail_url: course.thumbnail_url, price: course.price ?? null, category_id: course.category_id ?? null };
  const onClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); toggle(item); };
  if (variant === 'full') return <button type="button" onClick={onClick} aria-pressed={saved} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-colors ${saved ? 'border-gold bg-gold/15 text-gold-soft' : 'border-gold/35 text-gold-soft hover:border-gold hover:bg-gold/10'}`}><BookmarkIcon filled={saved} className="h-[18px] w-[18px]" />{saved ? 'Saved' : 'Save to Watchlist'}</button>;
  return <button type="button" onClick={onClick} aria-pressed={saved} aria-label={saved ? 'Remove from watchlist' : 'Save to watchlist'} title={saved ? 'Remove from watchlist' : 'Save to watchlist'} className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full shadow-[0_4px_14px_rgba(38,29,58,0.35)] ring-2 transition-all duration-150 hover:scale-110 active:scale-95 ${saved ? 'bg-gold text-[#fff] ring-[#fff]' : 'bg-[#fff] text-gold ring-gold/40 hover:bg-gold hover:text-[#fff]'}`}><BookmarkIcon filled={saved} className="h-5 w-5" /></button>;
}
