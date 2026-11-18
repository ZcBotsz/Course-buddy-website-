'use client';
import Link from 'next/link';
import type { Course } from '@/lib/types';
import { WatchlistButton } from './WatchlistButton';
import { GetAccessButton } from './GetAccessButton';
import { ThumbWithCategory } from './ThumbWithCategory';
import { ChevronRight, FolderIcon } from './Icons';
export function CourseCard({ course, childCount = 0, getAccess = true }: { course: Course; childCount?: number; getAccess?: boolean }) {
  const isBundle = childCount > 0;
  return <div className="relative h-full" data-testid="course-card">
    <Link href={`/course/${course.id}`} draggable={false} className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-[0_1px_2px_rgba(42,32,24,0.05),0_10px_28px_-14px_rgba(42,32,24,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(42,32,24,0.06),0_18px_36px_-16px_rgba(42,32,24,0.32)]">
      <div className="relative aspect-video w-full overflow-hidden bg-surface-raised">
        {course.thumbnail_url ? <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img aria-hidden src={course.thumbnail_url} alt="" loading="lazy" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-2xl saturate-150" />
          <ThumbWithCategory src={course.thumbnail_url} alt={course.title} category={course.categories} />
        </> : <div className="flex h-full items-center justify-center text-muted"><span className="font-display text-sm">{isBundle ? 'Folder' : 'No thumbnail'}</span></div>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <h3 className="line-clamp-2 font-display text-lg font-semibold text-white transition-colors group-hover:text-gold-soft">{course.title}</h3>
          {isBundle ? <FolderIcon className="h-4 w-4 shrink-0 text-muted" /> : null}
        </div>
        {isBundle ? <p className="mt-1 text-sm text-muted">{childCount} {childCount === 1 ? 'course' : 'courses'}</p> : null}
        <div className={`mt-3 flex flex-wrap gap-2 ${getAccess ? (isBundle ? 'min-h-9 pr-28' : 'min-h-9 pr-36') : ''}`} />
      </div>
    </Link>
    {!isBundle ? <div className="absolute right-2.5 top-2.5 z-10"><WatchlistButton course={course} /></div> : null}
    {getAccess ? <div className="absolute bottom-3 right-3 z-10">{isBundle ? <Link href={`/course/${course.id}`} className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border-2 border-gold/35 bg-surface px-4 py-[calc(0.5rem-2px)] text-sm font-semibold text-gold-soft transition-colors hover:border-gold hover:bg-gold/10">Details<ChevronRight /></Link> : <GetAccessButton title={course.title} compact />}</div> : null}
  </div>;
}
