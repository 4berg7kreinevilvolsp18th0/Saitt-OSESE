import { NextRequest, NextResponse } from 'next/server';
import { getPublishedContent, getPublishedContentByType } from '../../../../lib/repositories/contentRepo';
import { useVercelPostgres } from '../../../../lib/db';
import { supabase } from '../../../../lib/supabaseClient';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') as 'news' | 'guide' | 'faq' | null;
    const limitRaw = request.nextUrl.searchParams.get('limit');
    const limit = limitRaw ? Number(limitRaw) : undefined;

    if (useVercelPostgres) {
      const rows = type ? await getPublishedContentByType(type, limit) : await getPublishedContent(limit);
      return NextResponse.json({ data: rows });
    }

    let query = supabase
      .from('content')
      .select('id, type, title, slug, body, published_at, direction_id')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (type) query = query.eq('type', type);
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка загрузки контента' }, { status: 500 });
  }
}
