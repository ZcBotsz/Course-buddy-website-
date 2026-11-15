import { updates } from '@/lib/data';
import { groupUpdatesByMonth } from '@/lib/format';
import type { Course } from '@/lib/types';
import { CourseCatalog } from './CourseCatalog';
export function UpdatesFeed() {
  const groups = groupUpdatesByMonth(updates);
  return <div className="mt-6 space-y-10">{groups.map(([label, items]) => <section key={label}><div className="mb-5 flex items-center gap-4"><h2 className="font-heading shrink-0 text-xl text-foreground">{label}</h2><div className="h-px flex-1 bg-border" /></div><CourseCatalog courses={items.map(u => ({ id: u.course_id, title: u.courses?.title ?? u.title, description: u.description, thumbnail_url: u.courses?.thumbnail_url ?? null, price: null, sales_page_url: null, category_id: u.courses?.category_id ?? '', parent_course_id: null, sort_order: u.sort_order, categories: u.courses?.categories ?? { name: '', slug: '' }, child_count: 0 } as Course))} /></section>)}</div>;
}
