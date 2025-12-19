import { supabase } from './supabaseClient';

export type NotificationType = 'appeal_status' | 'appeal_assigned' | 'appeal_comment';

interface SendNotificationParams {
  userId: string;
  appealId?: string;
  type: NotificationType;
  title: string;
  message: string;
  url?: string;
}

/**
 * Отправка уведомлений пользователю (email и push)
 */
export async function sendNotification(params: SendNotificationParams) {
  const { userId, appealId, type, title, message, url } = params;

  try {
    // Получаем настройки уведомлений пользователя
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (settingsError || !settings) {
      console.warn('Notification settings not found for user:', userId);
      return { success: false, error: 'Settings not found' };
    }

    const results = {
      email: false,
      push: false,
    };

    // Отправляем email уведомление
    if (settings.email_enabled) {
      let emailEnabled = false;
      if (type === 'appeal_status' && settings.email_appeal_status) emailEnabled = true;
      if (type === 'appeal_assigned' && settings.email_appeal_assigned) emailEnabled = true;
      if (type === 'appeal_comment' && settings.email_appeal_comment) emailEnabled = true;

      if (emailEnabled) {
        try {
          // Получаем email пользователя из notification_settings или передаём через параметры
          // Для внутренних уведомлений email должен быть получен на сервере
          // Здесь просто вызываем API endpoint, который сам получит email
          const userEmail = null; // Email будет получен на сервере

          if (true) { // Всегда отправляем запрос, сервер проверит настройки
            const response = await fetch('/api/notifications/email/internal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                email: userEmail,
                appealId,
                type,
                title,
                message,
                url,
              }),
            });

            if (response.ok) {
              results.email = true;
            }
          }
        } catch (error) {
          console.error('Email notification error:', error);
        }
      }
    }

    // Отправляем push уведомление
    if (settings.push_enabled && settings.push_subscription) {
      let pushEnabled = false;
      if (type === 'appeal_status' && settings.push_appeal_status) pushEnabled = true;
      if (type === 'appeal_assigned' && settings.push_appeal_assigned) pushEnabled = true;
      if (type === 'appeal_comment' && settings.push_appeal_comment) pushEnabled = true;

      if (pushEnabled) {
        try {
          const response = await fetch(`${window.location.origin}/api/notifications/push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              appealId,
              type,
              title,
              message,
              url,
            }),
          });

          if (response.ok) {
            results.push = true;
          }
        } catch (error) {
          console.error('Push notification error:', error);
        }
      }
    }

    // Логируем уведомление
    await supabase.from('notification_log').insert({
      user_id: userId,
      appeal_id: appealId || null,
      type: results.email ? 'email' : results.push ? 'push' : 'email',
      event_type: type,
      title,
      message,
      success: results.email || results.push,
    });

    return { success: true, results };
  } catch (error: any) {
    console.error('Notification error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Отправка уведомлений всем заинтересованным пользователям при изменении обращения
 */
export async function notifyAppealChange(
  appealId: string,
  appealData: {
    status?: string;
    assigned_to?: string | null;
    title: string;
  }
) {
  const notifications: Promise<any>[] = [];

  // Уведомление назначенному пользователю об изменении статуса
  if (appealData.assigned_to && appealData.status) {
    const statusLabels: Record<string, string> = {
      new: 'Новое',
      in_progress: 'В работе',
      waiting: 'Ждём инфо',
      closed: 'Закрыто',
    };
