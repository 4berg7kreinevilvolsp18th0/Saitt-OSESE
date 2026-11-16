import { NextResponse } from 'next/server';
import { getActiveStudentOrganizations } from '../../../../lib/repositories/studentOrganizationsRepo';
import { useVercelPostgres } from '../../../../lib/db';
import { isSupabaseConfigured, supabase } from '../../../../lib/supabaseClient';

export const runtime = 'nodejs';

function unavailable(error: unknown) {
  console.error('Failed to load student organizations', error);
  return NextResponse.json({ error: 'Список объединений временно недоступен' }, { status: 503 });
}

export async function GET() {
  try {
    if (useVercelPostgres) {
      const rows = await getActiveStudentOrganizations();
      return NextResponse.json({ data: rows });
    }

    if (!isSupabaseConfigured()) return unavailable('Supabase is not configured');

    const { data, error } = await supabase
      .from('student_organizations')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (error) return unavailable(error);
    return NextResponse.json({ data: data || [] });
  } catch (error) {
    return unavailable(error);
  }
}
