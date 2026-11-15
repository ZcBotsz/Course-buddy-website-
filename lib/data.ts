import categoriesJson from '@/data/categories.json';
import coursesJson from '@/data/courses.json';
import updatesJson from '@/data/updates.json';
import type { Category, Course, Update } from './types';
export const categories = categoriesJson as Category[];
export const courses = coursesJson as Course[];
export const updates = updatesJson as Update[];
export const categoryBySlug = new Map(categories.map(c => [c.slug, c]));
export const categoryById = new Map(categories.map(c => [c.id, c]));
export const courseById = new Map(courses.map(c => [c.id, c]));
export const childCounts = courses.reduce<Record<string, number>>((acc, c) => { if (c.parent_course_id) acc[c.parent_course_id] = (acc[c.parent_course_id] || 0) + 1; return acc; }, {});
export function coursesInCategory(slug: string) { const cat = categoryBySlug.get(slug); if (!cat) return []; return courses.filter(c => c.category_id === cat.id && !c.parent_course_id).sort((a,b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title)); }
export function childCourses(parentId: string) { return courses.filter(c => c.parent_course_id === parentId).sort((a,b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title)); }
export function searchAll(q: string) { const s = q.trim().toLowerCase(); if (!s) return { categories: [] as Category[], courses: [] as Course[] }; return { categories: categories.filter(c => c.name.toLowerCase().includes(s)), courses: courses.filter(c => c.title.toLowerCase().includes(s) || (c.description || '').toLowerCase().includes(s)).sort((a,b) => a.title.localeCompare(b.title)) }; }
export const latestUpdateAt = updates[0]?.created_at ?? null;
