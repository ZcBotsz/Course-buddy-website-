import type { Database } from '@/types/database';

export type Course = Database['public']['Tables']['courses']['Row'];
export type CourseInsert = Database['public']['Tables']['courses']['Insert'];
export type CourseUpdate = Database['public']['Tables']['courses']['Update'];
export type Category = Database['public']['Tables']['categories']['Row'];

import { getSupabaseAdmin } from '@/lib/supabase/admin';

async function admin() {
  return getSupabaseAdmin();
}

export async function listCourses() {
  const sb = await admin();
  const { data, error } = await sb
    .from('courses')
    .select('*, categories(name, slug)')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Course[];
}

export async function getCourse(id: string) {
  const sb = await admin();
  const { data, error } = await sb
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Course;
}

export async function createCourse(input: CourseInsert) {
  const sb = await admin();
  const { data, error } = await sb.from('courses').insert(input).select().single();
  if (error) throw error;
  return data as Course;
}

export async function updateCourse(id: string, input: CourseUpdate) {
  const sb = await admin();
  const { data, error } = await sb
    .from('courses')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Course;
}

export async function deleteCourse(id: string) {
  const sb = await admin();
  const { error } = await sb.from('courses').delete().eq('id', id);
  if (error) throw error;
}

export async function listCategories() {
  const sb = await admin();
  const { data, error } = await sb
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function uploadCourseThumbnail(
  file: File,
  folder = 'course-thumbnails'
) {
  const sb = await admin();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const objectName = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await sb.storage
    .from('course-thumbnails')
    .upload(objectName, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });
  if (error) throw error;

  const { data } = sb.storage.from('course-thumbnails').getPublicUrl(objectName);
  return data.publicUrl;
}
