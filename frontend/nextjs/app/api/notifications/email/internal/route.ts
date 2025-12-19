import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, appealId, type, title, message, url } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Получаем email пользователя через Supabase Admin API
    // Требует service_role ключ в переменных окружения
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseServiceKey) {
      console.warn('SUPABASE_SERVICE_ROLE_KEY not set, cannot send email notifications');
      return NextResponse.json({ 
        success: false, 
        message: 'Email service not configured (missing service_role key)' 
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Supabase URL not configured' }, { status: 500 });
    }

    // Создаём клиент с service_role для доступа к auth.users
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Получаем email пользователя
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError || !userData?.user?.email) {
      console.error('Error getting user email:', userError);
      return NextResponse.json({ error: 'User not found or email unavailable' }, { status: 404 });
    }

    const email = userData.user.email;

    const emailService = process.env.EMAIL_SERVICE || 'resend';
    const emailApiKey = process.env.EMAIL_API_KEY;

    if (!emailApiKey) {
      console.warn('Email service not configured');
      return NextResponse.json({ 
        success: true, 
        message: 'Email уведомления не настроены' 
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oss-dvfu.vercel.app';
    const appealUrl = url || `${siteUrl}/admin/appeals${appealId ? `?appeal=${appealId}` : ''}`;

    const typeLabels: Record<string, { subject: string; intro: string }> = {
      appeal_status: {
        subject: 'Статус обращения изменён',
        intro: 'Статус обращения был изменён.',
      },
      appeal_assigned: {
        subject: 'Вам назначено обращение',
        intro: 'Вам было назначено новое обращение для обработки.',
      },
      appeal_comment: {
        subject: 'Новый комментарий к обращению',
        intro: 'К обращению был добавлен новый комментарий.',
      },
    };

    const typeInfo = typeLabels[type] || {
      subject: 'Уведомление от ОСС ДВФУ',
      intro: 'У вас новое уведомление.',
    };

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
            to: email,
            subject: typeInfo.subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #DC2626;">${typeInfo.subject}</h2>
                <p>Здравствуйте!</p>
                <p>${typeInfo.intro}</p>
                ${title ? `
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <strong>Обращение:</strong> ${title}
                </div>
                ` : ''}
                ${message ? `
                <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  ${message}
                </p>
                ` : ''}
                ${appealId ? `
                <p>
                  <a href="${appealUrl}" style="background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Открыть обращение
                  </a>
                </p>
                ` : ''}
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
          console.error('Email send error:', errorData);
          return NextResponse.json({ 
            success: false, 
            message: 'Failed to send email' 
          });
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Email sent' 
        });
      } catch (error: any) {
        console.error('Email notification error:', error);
        return NextResponse.json({ 
          success: false, 
          message: error.message 
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Notification sent' 
