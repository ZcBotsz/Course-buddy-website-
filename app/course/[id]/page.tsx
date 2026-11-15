import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { courseById, categoryById, childCourses, childCounts } from '@/lib/data';
import { CourseDetail } from '../../components/CourseDetail';
import { CourseCatalog } from '../../components/CourseCatalog';
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const c = courseById.get(id); return { title: c?.title ?? 'Course', description: c?.description ?? undefined }; }
export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const course = courseById.get(id); if (!course) notFound();
  const children = childCourses(id);
  if (children.length > 0) { const cat = categoryById.get(course.category_id); return <div className="mx-auto max-w-3xl lg:max-w-none"><nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">{cat ? <Link href={`/category/${cat.slug}`} className="cursor-pointer transition-colors hover:text-foreground">{cat.name}</Link> : null}<span className="flex items-center gap-1.5"><span aria-hidden>/</span><span className="text-foreground">{course.title}</span></span></nav><header className="mb-8 mt-4"><h1 className="font-display text-3xl text-foreground">{course.title}</h1><p className="mt-1 text-sm text-muted">{children.length} courses</p></header><CourseCatalog courses={children} childCounts={childCounts} emptyTitle="No courses here yet" /></div>; }
  return <CourseDetail course={course} />;
}
