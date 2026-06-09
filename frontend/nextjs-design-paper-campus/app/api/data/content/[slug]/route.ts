import { NextResponse } from 'next/server';
import { getPublishedContentBySlug } from '../../../../../lib/repositories/contentRepo';
import { useVercelPostgres } from '../../../../../lib/db';
import { supabase } from '../../../../../lib/supabaseClient';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    if (useVercelPostgres) {
      const item = await getPublishedContentBySlug(params.slug);
      if (!item) return NextResponse.json({ error: 'Контент не найден' }, { status: 404 });
      return NextResponse.json({ data: item });
    }

    const { data, error } = await supabase
      .from('content')
      .select('id, type, title, slug, body, published_at, direction_id')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single();

    if (error || !data) return NextResponse.json({ error: 'Контент не найден' }, { status: 404 });
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка загрузки контента' }, { status: 500 });
  }
}
