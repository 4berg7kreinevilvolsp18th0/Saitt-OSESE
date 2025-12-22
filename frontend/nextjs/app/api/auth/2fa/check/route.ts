import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth';
import { verify2FAToken, getUser2FASecret, is2FAEnabled } from '../../../../../lib/2fa';

export const dynamic = 'force-dynamic';

/**
 * Проверка 2FA токена при входе
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, token } = body;

    if (!userId || !token) {
      return NextResponse.json(
        { error: 'User ID and token are required' },
        { status: 400 }
      );
    }

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

