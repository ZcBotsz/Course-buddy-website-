import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '@/lib/courses';

async function getUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const courses = await listCourses();
    return NextResponse.json({ courses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Support _method override for PUT via POST (used by client components)
    if (body._method === 'PUT') {
      const id = body.id;
      if (!id) {
        return NextResponse.json({ error: 'Missing course id' }, { status: 400 });
      }
      const { id: _, _method: __, ...updates } = body;
      const course = await updateCourse(id, updates);
      return NextResponse.json({ course });
    }

    const course = await createCourse({
      title: body.title,
      description: body.description ?? null,
      thumbnail_url: body.thumbnail_url ?? null,
      price: body.price ?? null,
      sales_page_url: body.sales_page_url ?? null,
      category_id: body.category_id,
      parent_course_id: body.parent_course_id ?? null,
      sort_order: body.sort_order ?? 0,
      content: body.content ?? null,
    });
    return NextResponse.json({ course }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing course id' }, { status: 400 });
    }

    const { id: _, ...updates } = body;
    const course = await updateCourse(id, updates);
    return NextResponse.json({ course });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing course id' }, { status: 400 });
    }

    await deleteCourse(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
