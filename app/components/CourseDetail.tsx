import Link from 'next/link';
import type { Course } from '@/lib/types';
import { categoryById } from '@/lib/data';
import { GetAccessButton } from './GetAccessButton';
import { WatchlistButton } from './WatchlistButton';
import { ThumbWithCategory } from './ThumbWithCategory';
export function CourseDetail({ course }: { course: Course }) {
  const cat = categoryById.get(course.category_id);
  return <div className="max-w-5xl">
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">{cat ? <Link href={`/category/${cat.slug}`} className="cursor-pointer transition-colors hover:text-foreground">{cat.name}</Link> : null}<span className="flex items-center gap-1.5"><span aria-hidden>/</span><span className="text-foreground">{course.title}</span></span></nav>
    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center lg:gap-8">
        <div className="flex justify-center">{course.thumbnail_url ? <ThumbWithCategory inline src={course.thumbnail_url} alt={course.title} category={cat} /> : <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-xl bg-surface-raised text-muted">No thumbnail</div>}</div>
        <div className="mt-5 lg:mt-0">
          <h1 className="font-display text-2xl leading-tight text-foreground">{course.title}</h1>
          {course.price ? <p className="mt-2 text-sm font-semibold text-gold-soft">{course.price}</p> : null}
          <div className="mt-5 flex flex-wrap items-center gap-3"><GetAccessButton title={course.title} /><WatchlistButton course={course} variant="full" /></div>
        </div>
      </div>
      {course.description ? <div className="px-5 pb-5 sm:px-6 sm:pb-6"><div className="mt-6 border-t border-border pt-5"><h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">About this course</h2><p className="mt-3 whitespace-pre-line text-sm leading-6 text-foreground/85">{course.description}</p></div></div> : null}
    </div>
  </div>;
}
