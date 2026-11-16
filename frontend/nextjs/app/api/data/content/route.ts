import { NextRequest, NextResponse } from 'next/server';
import { getPublishedContent, getPublishedContentByType } from '../../../../lib/repositories/contentRepo';
import { useVercelPostgres } from '../../../../lib/db';
import { isSupabaseConfigured, supabase } from '../../../../lib/supabaseClient';

export const runtime = 'nodejs';

function unavailable(error: unknown) {
  console.error('Failed to load public content', error);
  return NextResponse.json({ error: 'Публикации временно недоступны' }, { status: 503 });
}

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');
    if (type !== null && type !== 'news' && type !== 'guide' && type !== 'faq') {
      return NextResponse.json({ error: 'Неизвестный тип материала' }, { status: 400 });
    }
    const limitRaw = request.nextUrl.searchParams.get('limit');
    const limit = limitRaw === null ? undefined : Number(limitRaw);
    if (limit !== undefined && (!Number.isSafeInteger(limit) || limit < 1)) {
      return NextResponse.json({ error: 'Некорректный лимит' }, { status: 400 });
    }

    if (useVercelPostgres) {
      const rows = type ? await getPublishedContentByType(type, limit) : await getPublishedContent(limit);
      return NextResponse.json({ data: rows });
    }

    if (!isSupabaseConfigured()) return unavailable('Supabase is not configured');

    let query = supabase
      .from('content')
      .select('id, type, title, slug, body, published_at, direction_id, direction:directions(title, slug)')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false });
    if (type) query = query.eq('type', type);
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) return unavailable(error);
    const rows = (data ?? []).map(({ direction, ...item }) => {
      const relation = Array.isArray(direction) ? direction[0] : direction;
      return {
        ...item,
        direction_title: relation?.title ?? null,
        direction_slug: relation?.slug ?? null,
      };
    });

    return NextResponse.json({ data: rows });
  } catch (error) {
    return unavailable(error);
  }
}
