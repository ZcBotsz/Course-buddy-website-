import type { Course } from '@/lib/types';
import { CourseCard } from './CourseCard';
export function CourseCatalog({ courses, childCounts = {}, columns = 4, getAccess = true, emptyTitle = 'No courses in this category yet', emptyDescription = 'Check back soon — new courses are added regularly.' }: { courses: Course[]; childCounts?: Record<string, number>; columns?: 3 | 4; getAccess?: boolean; emptyTitle?: string; emptyDescription?: string }) {
  if (!courses.length) return <div className="py-16 text-center"><h3 className="font-display text-lg text-foreground">{emptyTitle}</h3><p className="mx-auto mt-2 max-w-sm text-sm text-muted">{emptyDescription}</p></div>;
  return <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${columns === 4 ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3'}`}>{courses.map(c => <CourseCard key={c.id} course={c} childCount={childCounts[c.id] ?? c.child_count ?? 0} getAccess={getAccess} />)}</div>;
}
