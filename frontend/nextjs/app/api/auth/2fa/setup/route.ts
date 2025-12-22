import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { generate2FASecret, generate2FAQRCodeURL } from '../../../../lib/2fa';
import { supabase } from '../../../../lib/supabaseClient';

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
