import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { categories, categoryBySlug, coursesInCategory, childCounts } from '@/lib/data';
import { CourseCatalog } from '../../components/CourseCatalog';
import { CategoryPills } from '../../components/CategoryPills';
import { GlobalSearchBar } from '../../components/GlobalSearchBar';
export function generateStaticParams() { return categories.map(c => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const cat = categoryBySlug.get(slug); return { title: cat?.name ?? 'Category' }; }
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const cat = categoryBySlug.get(slug); if (!cat) notFound();
  const courses = coursesInCategory(slug);
  return <div className="mx-auto max-w-3xl lg:max-w-none"><Suspense fallback={null}><GlobalSearchBar /></Suspense><div className="mt-6"><CategoryPills /><header className="mb-8"><h1 className="font-display text-3xl text-foreground">{cat.name}</h1>{cat.description ? <p className="mt-2 text-sm text-muted">{cat.description}</p> : null}<p className="mt-1 text-sm text-muted">{cat.count} courses</p></header><CourseCatalog courses={courses} childCounts={childCounts} /></div></div>;
}
