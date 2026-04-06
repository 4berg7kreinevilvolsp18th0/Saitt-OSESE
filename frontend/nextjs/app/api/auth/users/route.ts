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
    // #region agent log
    fetch('http://127.0.0.1:7816/ingest/14bbcc59-fd66-424d-bf13-862cc5c64d18',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'107e96'},body:JSON.stringify({sessionId:'107e96',runId:'run2',hypothesisId:'F',location:'app/api/auth/users/route.ts:32',message:'auth users route resolved active users lookup',data:{returnedUsersCount:users.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return NextResponse.json({ data: users });
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7816/ingest/14bbcc59-fd66-424d-bf13-862cc5c64d18',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'107e96'},body:JSON.stringify({sessionId:'107e96',runId:'run2',hypothesisId:'F',location:'app/api/auth/users/route.ts:36',message:'auth users route failed',data:{error:error?.message ?? 'unknown'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const status = error?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: error?.message || 'users error' }, { status });
  }
}
