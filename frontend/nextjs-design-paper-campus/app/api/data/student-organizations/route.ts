import { NextResponse } from 'next/server';
import { getActiveStudentOrganizations } from '../../../../lib/repositories/studentOrganizationsRepo';
import { useVercelPostgres } from '../../../../lib/db';
import { supabase } from '../../../../lib/supabaseClient';

export const runtime = 'nodejs';

export async function GET() {
  try {
    if (useVercelPostgres) {
      const rows = await getActiveStudentOrganizations();
      return NextResponse.json({ data: rows });
    }

    const { data, error } = await supabase
      .from('student_organizations')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Ошибка загрузки студенческих объединений' },
      { status: 500 }
    );
  }
}
