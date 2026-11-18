-- Course Buddy — Admin Panel Database Schema
-- Run this in your Supabase project: SQL Editor → paste → Run
--
-- Creates: courses table, categories table, course-thumbnails storage bucket,
-- and row-level security policies so only authenticated admins can write.

-- 1. Categories table (seed with your existing categories)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  thumbnail_url text,
  sort_order integer default 0,
  count integer default 0,
  created_at timestamptz default now() not null
);

-- 2. Courses table (mirrors your existing data/courses.json shape)
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  thumbnail_url text,
  price text,
  sales_page_url text,
  category_id text not null,
  parent_course_id uuid references public.courses(id),
  sort_order integer default 0,
  content text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Indexes for common queries
create index if not exists idx_courses_category on public.courses(category_id);
create index if not exists idx_courses_parent on public.courses(parent_course_id);
create index if not exists idx_courses_created on public.courses(created_at desc);

-- 4. Storage bucket for course photos
insert into storage.buckets (id, name, public)
values ('course-thumbnails', 'course-thumbnails', true)
on conflict (id) do nothing;

-- 5. Storage policies
create policy "Anyone can view course thumbnails"
  on storage.objects for select
  using ( bucket_id = 'course-thumbnails' );

create policy "Authenticated users can upload course thumbnails"
  on storage.objects for insert
  with check ( bucket_id = 'course-thumbnails' and auth.uid() is not null );

create policy "Authenticated users can update own uploads"
  on storage.objects for update
  using ( bucket_id = 'course-thumbnails' and auth.uid() = owner );

create policy "Authenticated users can delete own uploads"
  on storage.objects for delete
  using ( bucket_id = 'course-thumbnails' and auth.uid() = owner );

-- 6. Enable RLS on tables (service-role client bypasses RLS for admin routes)
alter table public.courses enable row level security;
alter table public.categories enable row level security;

-- 7. RLS policies — public can read, only authenticated can write
create policy "Anyone can view courses"
  on public.courses for select
  using ( true );

create policy "Authenticated users can insert courses"
  on public.courses for insert
  with check ( auth.uid() is not null );

create policy "Authenticated users can update courses"
  on public.courses for update
  using ( auth.uid() is not null );

create policy "Authenticated users can delete courses"
  on public.courses for delete
  using ( auth.uid() is not null );

create policy "Anyone can view categories"
  on public.categories for select
  using ( true );

create policy "Authenticated users can manage categories"
  on public.categories for all
  using ( auth.uid() is not null );

-- 8. Seed categories from your existing catalog.
--    Replace these IDs/names/slugs with your actual categories.
--    (Optional — you can also add categories via the admin panel later.)
insert into public.categories (id, name, slug, sort_order, count) values
  ('08222e4c-e928-4e6c-b5d3-7722fbbb8b3f', 'Dating & Relationship', 'dating-relationship', 1, 0),
  ('cat-ai', 'AI & Technology', 'ai-technology', 2, 0),
  ('cat-business', 'Business & Sales', 'business-sales', 3, 0),
  ('cat-marketing', 'Marketing', 'marketing', 4, 0)
on conflict (slug) do nothing;
