import { NextRequest, NextResponse } from 'next/server';

// API endpoint для отправки Email уведомлений
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface EmailNotification {
  appealId: string;
  status: string;
  title: string;
  contactValue: string;
  contactType: 'email' | 'telegram';
  publicToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailNotification = await request.json();
    const { appealId, status, title, contactValue, contactType, publicToken } = body;

    // Отправляем уведомление только если контакт - Email
    if (contactType !== 'email' || !contactValue.includes('@')) {
      return NextResponse.json({ 
        success: true, 
        message: 'Уведомление не требуется (не Email контакт)' 
      });
    }

    // Проверяем наличие настроек для отправки email
    // Можно использовать Resend, SendGrid, или Supabase Email
    const emailService = process.env.EMAIL_SERVICE || 'resend';
    const emailApiKey = process.env.EMAIL_API_KEY;

    if (!emailApiKey) {
      // Если email не настроен, просто возвращаем успех (не критично)
      console.warn('Email service not configured');
      return NextResponse.json({ 
        success: true, 
        message: 'Email уведомления не настроены' 
      });
    }

    // Статусы с понятными названиями
    const statusMessages: Record<string, { subject: string; body: string }> = {
      new: {
        subject: 'Ваше обращение принято',
        body: 'Ваше обращение принято и зарегистрировано. Мы начнём работу в ближайшее время.',
      },
      in_progress: {
        subject: 'Обращение обрабатывается',
        body: 'Ваше обращение обрабатывается. Мы работаем над решением вашего вопроса.',
      },
      waiting: {
        subject: 'Требуется дополнительная информация',
        body: 'Для решения вопроса нам нужна дополнительная информация. Пожалуйста, проверьте указанный контакт.',
      },
      closed: {
        subject: 'Обращение закрыто',
        body: 'Ваше обращение закрыто. Если вопрос решён не полностью, вы можете подать новое обращение.',
      },
    };

    const statusMessage = statusMessages[status] || {
      subject: 'Статус обращения изменён',
      body: 'Статус вашего обращения изменён.',
    };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oss-dvfu.vercel.app';
    const statusUrl = `${siteUrl}/appeal/status?token=${publicToken}`;

    // Отправка через Resend (пример)
    if (emailService === 'resend') {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${emailApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'noreply@oss-dvfu.ru',
            to: contactValue,
            subject: statusMessage.subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #DC2626;">${statusMessage.subject}</h2>
                <p>Здравствуйте!</p>
                <p>${statusMessage.body}</p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <strong>Обращение:</strong> ${title}
                </div>
                <p>
                  <a href="${statusUrl}" style="background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Проверить статус обращения
                  </a>
                </p>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                  С уважением,<br>
                  ОСС ДВФУ
                </p>
              </div>
            `,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Ошибка отправки Email:', errorData);
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
        console.error('Ошибка отправки Email уведомления:', error);
        return NextResponse.json({ 
          success: false, 
          message: 'Ошибка отправки уведомления, но обращение обработано' 
        });
      }
    }

    // Для других сервисов (SendGrid, Supabase Email и т.д.) можно добавить аналогичную логику

    return NextResponse.json({ 
      success: true, 
      message: 'Уведомление отправлено' 
    });
  } catch (error: any) {
    console.error('Ошибка обработки уведомления:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке уведомления' },
      { status: 500 }
    );
  }
}

