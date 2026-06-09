import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth-server';
import { getUserRolesByUserId } from '../../../../lib/repositories/userRolesRepo';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await requireAuth();
    const roles = await getUserRolesByUserId(user.id);
    return NextResponse.json({ data: roles });
  } catch (error: any) {
    const status = error?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: error.message || 'roles error' }, { status });
  }
}
