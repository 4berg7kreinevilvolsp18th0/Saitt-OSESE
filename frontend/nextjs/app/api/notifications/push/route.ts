import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, appealId, type, title, message, url } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Получаем настройки уведомлений пользователя
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('push_enabled, push_subscription, push_appeal_status, push_appeal_assigned, push_appeal_comment')
      .eq('user_id', userId)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    if (!settings.push_enabled || !settings.push_subscription) {
      return NextResponse.json({ error: 'Push notifications not enabled' }, { status: 400 });
    }

    // Проверяем, включено ли уведомление для этого типа события
    let eventEnabled = false;
    if (type === 'appeal_status' && settings.push_appeal_status) eventEnabled = true;
    if (type === 'appeal_assigned' && settings.push_appeal_assigned) eventEnabled = true;
    if (type === 'appeal_comment' && settings.push_appeal_comment) eventEnabled = true;

    if (!eventEnabled) {
      return NextResponse.json({ error: 'Notification type not enabled' }, { status: 400 });
    }

    // Отправляем push-уведомление через VAPID
    const subscription = settings.push_subscription;
    const payload = JSON.stringify({
      title: title || 'ОСС ДВФУ',
      body: message || 'У вас новое уведомление',
      tag: type,
      data: {
        url: url || `/admin/appeals${appealId ? `?appeal=${appealId}` : ''}`,
        appealId,
      },
    });

    // Здесь должен быть вызов к сервису отправки push (например, через web-push библиотеку)
    // Для продакшена нужен VAPID ключ и серверная библиотека web-push
