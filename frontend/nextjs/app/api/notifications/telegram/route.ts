import { NextRequest, NextResponse } from 'next/server';

// API endpoint для отправки Telegram уведомлений
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TelegramNotification {
  appealId: string;
  status: string;
  title: string;
  contactValue: string;
  contactType: 'email' | 'telegram';
  publicToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramNotification = await request.json();
    const { appealId, status, title, contactValue, contactType, publicToken } = body;

    // Проверяем наличие токена бота
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      // Если токен не настроен, просто возвращаем успех (не критично)
      return NextResponse.json({ 
        success: true, 
        message: 'Telegram уведомления не настроены' 
      });
    }

    // Отправляем уведомление только если контакт - Telegram
    if (contactType !== 'telegram' || !contactValue.startsWith('@')) {
      return NextResponse.json({ 
        success: true, 
        message: 'Уведомление не требуется (не Telegram контакт)' 
      });
    }

    const telegramUsername = contactValue.replace('@', '');
    
    // Статусы с понятными названиями
    const statusMessages: Record<string, string> = {
      new: '✅ Ваше обращение принято и зарегистрировано. Мы начнём работу в ближайшее время.',
      in_progress: '⚙️ Ваше обращение обрабатывается. Мы работаем над решением вашего вопроса.',
      waiting: '⏳ Для решения вопроса нам нужна дополнительная информация. Пожалуйста, проверьте указанный контакт.',
      closed: '✅ Ваше обращение закрыто. Если вопрос решён не полностью, вы можете подать новое обращение.',
    };

    const statusMessage = statusMessages[status] || 'Статус вашего обращения изменён.';

    // Формируем сообщение
    const message = `📋 Обращение: "${title}"\n\n${statusMessage}\n\n🔗 Проверить статус: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://oss-dvfu.vercel.app'}/appeal/status?token=${publicToken}`;

    // Пытаемся отправить сообщение через Telegram Bot API
    // Примечание: Bot API не позволяет отправлять сообщения пользователям напрямую
    // Нужно либо:
    // 1. Пользователь должен начать диалог с ботом
    // 2. Использовать канал для уведомлений
    // 3. Использовать другой метод (webhook, polling)

    // Вариант 1: Отправка в канал уведомлений (если настроен)
    const notificationChannel = process.env.TELEGRAM_NOTIFICATION_CHANNEL || '@oss_dvfu';
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: notificationChannel,
            text: `🔔 Уведомление для ${contactValue}:\n\n${message}`,
            parse_mode: 'HTML',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Ошибка отправки Telegram:', errorData);
        // Не возвращаем ошибку, чтобы не блокировать работу системы
        return NextResponse.json({ 
          success: false, 
          message: 'Не удалось отправить уведомление, но обращение обработано' 
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Уведомление отправлено' 
      });
    } catch (error: any) {
      console.error('Ошибка отправки Telegram уведомления:', error);
      // Не блокируем работу системы, если уведомление не отправилось
      return NextResponse.json({ 
        success: false, 
        message: 'Ошибка отправки уведомления, но обращение обработано' 
      });
    }
  } catch (error: any) {
    console.error('Ошибка обработки уведомления:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке уведомления' },
      { status: 500 }
    );
  }
}

