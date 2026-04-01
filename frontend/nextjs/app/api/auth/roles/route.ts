import { NextRequest, NextResponse } from 'next/server';
import { getUserRolesByUserId } from '../../../../lib/repositories/userRolesRepo';
import { useVercelPostgres } from '../../../../lib/db';
import { supabase } from '../../../../lib/supabaseClient';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  try {
    if (useVercelPostgres) {
      const roles = await getUserRolesByUserId(userId);
      return NextResponse.json({ data: roles });
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role, direction_id')
      .eq('user_id', userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'roles error' }, { status: 500 });
  }
}
