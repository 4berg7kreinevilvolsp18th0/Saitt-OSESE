import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { verify2FAToken, getUser2FASecret } from '../../../../lib/2fa';
import { supabase } from '../../../../lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * Верификация 2FA токена и включение 2FA
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token, enable } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Получить секрет пользователя
    const secret = await getUser2FASecret(user.id);
    if (!secret) {
      return NextResponse.json(
        { error: '2FA not configured' },
        { status: 400 }
      );
    }

    // Верификация токена
    const isValid = verify2FAToken(token, secret);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    // Если нужно включить 2FA
    if (enable) {
      // Генерация backup кодов
      const backupCodes = Array.from({ length: 10 }, () => {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
      });

      const { error: updateError } = await supabase
        .from('user_2fa')
        .update({
          enabled: true,
          backup_codes: backupCodes,
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error enabling 2FA:', updateError);
        return NextResponse.json(
          { error: 'Failed to enable 2FA' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        backupCodes, // Показать пользователю для сохранения
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify 2FA' },
      { status: 500 }
    );
  }
}

