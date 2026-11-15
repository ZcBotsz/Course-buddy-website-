'use client';
import { useWatchlist } from '../components/WatchlistProvider';
import { courseById } from '@/lib/data';
import type { Course } from '@/lib/types';
import { CourseCatalog } from '../components/CourseCatalog';
export default function WatchlistPage() {
  const { items, ready } = useWatchlist();
  const courses = items.map(i => courseById.get(i.id) ?? ({ id: i.id, title: i.title, description: null, thumbnail_url: i.thumbnail_url, price: i.price, sales_page_url: null, category_id: i.category_id ?? '', parent_course_id: null, sort_order: 0, categories: { name: '', slug: '' }, child_count: 0 } as Course));
  return <div className="mx-auto max-w-3xl lg:max-w-none"><h1 className="font-display text-[1.6rem] leading-tight text-foreground sm:text-3xl">Watchlist</h1><p className="mt-2 text-sm text-muted">Courses you save appear here on this device.</p><div className="mt-6">{ready ? <CourseCatalog courses={courses} emptyTitle="Your watchlist is empty" emptyDescription="Tap the bookmark on any course to save it here." /> : null}</div></div>;
}
