import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '../../../../lib/auth-server';
import { getActiveUsers, getUsersByIds } from '../../../../lib/repositories/usersRepo';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const idsParam = request.nextUrl.searchParams.get('ids');
    const limitParam = Number(request.nextUrl.searchParams.get('limit') ?? '100');

    if (idsParam) {
      const ids = idsParam
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

      const users = await getUsersByIds(ids);
      return NextResponse.json({ data: users });
    }

    const users = await getActiveUsers(Number.isFinite(limitParam) ? limitParam : 100);
    return NextResponse.json({ data: users });
  } catch (error: any) {
    const status = error?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: error?.message || 'users error' }, { status });
  }
}
