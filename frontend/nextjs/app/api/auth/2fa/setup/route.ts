import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth';
import { generate2FASecret, generate2FAQRCodeURL } from '../../../../../lib/2fa';
import { supabase } from '../../../../../lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * Настройка 2FA для пользователя
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

    // Проверить, не настроена ли уже 2FA
    const { data: existing2FA } = await supabase
      .from('user_2fa')
      .select('enabled')
      .eq('user_id', user.id)
      .single();

    if (existing2FA?.enabled) {
      return NextResponse.json(
        { error: '2FA already enabled' },
        { status: 400 }
      );
    }

    // Генерация секрета
    const secret = generate2FASecret();
    const qrCodeURL = generate2FAQRCodeURL(user.email || 'user', secret);

    // Сохранение секрета (пока не включено)
    const { error: insertError } = await supabase
      .from('user_2fa')
      .upsert({
        user_id: user.id,
        secret,
        enabled: false,
        backup_codes: [], // Генерация backup кодов позже
      }, {
        onConflict: 'user_id',
      });

    if (insertError) {
      console.error('Error saving 2FA secret:', insertError);
      return NextResponse.json(
        { error: 'Failed to save 2FA secret' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      secret,
      qrCodeURL,
    });
  } catch (error: any) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    );
  }
}

