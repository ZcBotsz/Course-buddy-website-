import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

async function getUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use PNG, JPG, WebP, or GIF.' },
        { status: 415 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 25 MB)' }, { status: 413 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const objectName = `course-thumbnails/${user.id}/${crypto.randomUUID()}.${ext}`;

    const sb = getSupabaseAdmin();
    const { error: uploadError } = await sb.storage
      .from('course-thumbnails')
      .upload(objectName, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = sb.storage.from('course-thumbnails').getPublicUrl(objectName);

    return NextResponse.json({ url: data.publicUrl, path: objectName });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
