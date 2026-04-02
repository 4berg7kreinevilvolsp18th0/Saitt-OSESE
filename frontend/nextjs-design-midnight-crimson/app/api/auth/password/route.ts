import { NextRequest, NextResponse } from 'next/server';

import { getSessionDbUser, requireAuth } from '../../../../lib/auth-server';
import { hashPassword, verifyPassword } from '../../../../lib/password';
import { updateUserPassword } from '../../../../lib/repositories/usersRepo';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await requireAuth();
    const dbUser = await getSessionDbUser();

    if (!dbUser) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const body = await request.json();
    const currentPassword =
      typeof body?.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : '';

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Текущий и новый пароль обязательны' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Новый пароль должен быть не менее 8 символов' },
        { status: 400 }
      );
    }

    const isCurrentPasswordValid = await verifyPassword(currentPassword, dbUser.password_hash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Текущий пароль неверный' }, { status: 400 });
    }

    const newPasswordHash = await hashPassword(newPassword);
    await updateUserPassword(sessionUser.id, newPasswordHash);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: error?.message || 'Не удалось обновить пароль' }, { status });
  }
}
