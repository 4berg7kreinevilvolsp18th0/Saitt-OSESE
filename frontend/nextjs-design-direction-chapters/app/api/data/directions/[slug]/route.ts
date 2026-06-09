import { NextResponse } from 'next/server';
import { getDirectionBySlug } from '../../../../../lib/repositories/directionsRepo';
import { useVercelPostgres } from '../../../../../lib/db';
import { supabase } from '../../../../../lib/supabaseClient';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    if (useVercelPostgres) {
      const direction = await getDirectionBySlug(params.slug);
      if (!direction) return NextResponse.json({ error: 'Направление не найдено' }, { status: 404 });
      return NextResponse.json({ data: direction });
    }

    const { data, error } = await supabase
      .from('directions')
      .select('id, slug, title, description, color_key')
      .eq('slug', params.slug)
      .eq('is_active', true)
      .single();

    if (error || !data) return NextResponse.json({ error: 'Направление не найдено' }, { status: 404 });
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка загрузки направления' }, { status: 500 });
  }
}
