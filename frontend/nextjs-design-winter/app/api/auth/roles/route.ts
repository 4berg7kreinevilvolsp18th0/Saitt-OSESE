import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth-server';
import { getUserRolesByUserId } from '../../../../lib/repositories/userRolesRepo';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await requireAuth();
    const roles = await getUserRolesByUserId(user.id);
    // #region agent log
    fetch('http://127.0.0.1:7816/ingest/14bbcc59-fd66-424d-bf13-862cc5c64d18',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'107e96'},body:JSON.stringify({sessionId:'107e96',runId:'run1',hypothesisId:'A',location:'app/api/auth/roles/route.ts:11',message:'roles route resolved session roles',data:{userIdPrefix:user.id.slice(0,8),roles:roles.map((role)=>role.role),rolesCount:roles.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return NextResponse.json({ data: roles });
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7816/ingest/14bbcc59-fd66-424d-bf13-862cc5c64d18',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'107e96'},body:JSON.stringify({sessionId:'107e96',runId:'run1',hypothesisId:'A',location:'app/api/auth/roles/route.ts:15',message:'roles route failed',data:{error:error?.message ?? 'unknown'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const status = error?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: error.message || 'roles error' }, { status });
  }
}
