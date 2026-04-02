import { NextResponse } from 'next/server';
import { getActiveDirections } from '../../../../lib/repositories/directionsRepo';
import { useVercelPostgres } from '../../../../lib/db';
import { supabase } from '../../../../lib/supabaseClient';

export const runtime = 'nodejs';

export async function GET() {
  try {
    if (useVercelPostgres) {
      const rows = await getActiveDirections();
      return NextResponse.json({ data: rows });
    }

    const { data, error } = await supabase
      .from('directions')
      .select('id, slug, title, description, color_key')
      .eq('is_active', true);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка загрузки направлений' }, { status: 500 });
  }
}
