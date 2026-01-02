import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth';
import { verify2FAToken, getUser2FASecret, is2FAEnabled } from '../../../../../lib/2fa';

export const dynamic = 'force-dynamic';

/**
 * Проверка 2FA токена при входе
 * БЕЗОПАСНОСТЬ: Использует userId из сессии, а не из тела запроса
 */
export async function POST(request: NextRequest) {
  try {
    // Получить пользователя из сессии (серверные данные, не контролируются пользователем)
    const { user } = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Использовать userId из сессии, а не из запроса
    const userId = user.id;

    // Проверить, включена ли 2FA
    const enabled = await is2FAEnabled(userId);
    if (!enabled) {
      return NextResponse.json({
        required: false,
        verified: true,
      });
    }

    // Получить секрет и верифицировать
    const secret = await getUser2FASecret(userId);
    if (!secret) {
      return NextResponse.json(
        { error: '2FA not configured' },
        { status: 400 }
      );
    }

    const isValid = verify2FAToken(token, secret);
    return NextResponse.json({
      required: true,
      verified: isValid,
    });
  } catch (error: any) {
    console.error('2FA check error:', error);
    return NextResponse.json(
      { error: 'Failed to check 2FA' },
      { status: 500 }
    );
  }
}
