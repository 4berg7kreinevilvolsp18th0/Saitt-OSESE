import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TelegramAdminNotification {
  userId: string;
  appealId?: string;
  type: 'appeal_status' | 'appeal_assigned' | 'appeal_comment' | 'appeal_new' | 'appeal_overdue' | 'appeal_escalated';
  title: string;
  message: string;
  url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramAdminNotification = await request.json();
    const { userId, appealId, type, title, message, url } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Проверяем наличие токена бота
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ 
        success: false, 
        message: 'Telegram уведомления не настроены (отсутствует TELEGRAM_BOT_TOKEN)' 
      });
    }

    // Получаем настройки уведомлений пользователя
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('notification_settings')
      .select('telegram_enabled, telegram_chat_id, telegram_appeal_status, telegram_appeal_assigned, telegram_appeal_comment, telegram_appeal_new, telegram_appeal_overdue, telegram_appeal_escalated')
      .eq('user_id', userId)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    if (!settings.telegram_enabled || !settings.telegram_chat_id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Telegram уведомления не включены или не подключены' 
      });
    }

    // Проверяем, включено ли уведомление для этого типа события
    let eventEnabled = false;
    if (type === 'appeal_status' && settings.telegram_appeal_status) eventEnabled = true;
    if (type === 'appeal_assigned' && settings.telegram_appeal_assigned) eventEnabled = true;
    if (type === 'appeal_comment' && settings.telegram_appeal_comment) eventEnabled = true;
    if (type === 'appeal_new' && settings.telegram_appeal_new) eventEnabled = true;
    if (type === 'appeal_overdue' && settings.telegram_appeal_overdue) eventEnabled = true;
    if (type === 'appeal_escalated' && settings.telegram_appeal_escalated) eventEnabled = true;

    if (!eventEnabled) {
      return NextResponse.json({ 
        success: false, 
        message: 'Уведомления этого типа отключены в настройках' 
      });
    }

    // Формируем сообщение для Telegram
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oss-dvfu.vercel.app';
    const appealLink = appealId ? `${siteUrl}/admin/appeals?appeal=${appealId}` : (url || `${siteUrl}/admin/appeals`);
    
    const telegramMessage = `🔔 *${title}*\n\n${message}\n\n🔗 [Открыть в панели](${appealLink})`;

    // Отправляем сообщение в Telegram
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: settings.telegram_chat_id,
            text: telegramMessage,
            parse_mode: 'Markdown',
            disable_web_page_preview: false,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API error:', errorData);
        return NextResponse.json({ 
          success: false, 
          message: 'Не удалось отправить уведомление в Telegram',
          error: errorData.description 
        });
      }

      // Логируем уведомление
      await supabaseAdmin.from('notification_log').insert({
        user_id: userId,
        appeal_id: appealId || null,
        type: 'telegram',
        event_type: type,
        title,
        message,
        success: true,
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Уведомление отправлено в Telegram' 
      });
    } catch (error: any) {
      console.error('Telegram notification error:', error);
      
      // Логируем ошибку
      await supabaseAdmin.from('notification_log').insert({
        user_id: userId,
        appeal_id: appealId || null,
        type: 'telegram',
        event_type: type,
        title,
        message,
        success: false,
        error_message: error.message,
      });

      return NextResponse.json({ 
        success: false, 
        message: 'Ошибка при отправке уведомления в Telegram',
        error: error.message 
      });
    }
  } catch (error: any) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке уведомления' },
      { status: 500 }
    );
  }
}

