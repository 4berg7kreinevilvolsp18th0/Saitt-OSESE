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
