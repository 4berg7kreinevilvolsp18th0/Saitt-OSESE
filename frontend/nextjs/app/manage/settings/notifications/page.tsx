'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { getCurrentUser } from '../../../../lib/auth';
import { useToast } from '../../../../components/ToastProvider';

interface NotificationSettings {
  id?: string;
  // Email
  email_enabled: boolean;
  email_appeal_status: boolean;
  email_appeal_assigned: boolean;
  email_appeal_comment: boolean;
  email_appeal_new: boolean;
  email_appeal_overdue: boolean;
  email_appeal_escalated: boolean;
  email_daily_summary: boolean;
  // Push
  push_enabled: boolean;
  push_appeal_status: boolean;
  push_appeal_assigned: boolean;
  push_appeal_comment: boolean;
  push_appeal_new: boolean;
  push_appeal_overdue: boolean;
  push_appeal_escalated: boolean;
  // Telegram
  telegram_enabled: boolean;
  telegram_chat_id?: string | null;
  telegram_username?: string | null;
  telegram_appeal_status: boolean;
  telegram_appeal_assigned: boolean;
  telegram_appeal_comment: boolean;
  telegram_appeal_new: boolean;
  telegram_appeal_overdue: boolean;
  telegram_appeal_escalated: boolean;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email_enabled: true,
    email_appeal_status: true,
    email_appeal_assigned: true,
    email_appeal_comment: true,
    email_appeal_new: true,
    email_appeal_overdue: true,
    email_appeal_escalated: true,
    email_daily_summary: false,
    push_enabled: false,
    push_appeal_status: true,
    push_appeal_assigned: true,
    push_appeal_comment: true,
    push_appeal_new: true,
    push_appeal_overdue: true,
    push_appeal_escalated: true,
    telegram_enabled: false,
    telegram_chat_id: null,
    telegram_username: null,
    telegram_appeal_status: true,
    telegram_appeal_assigned: true,
    telegram_appeal_comment: true,
    telegram_appeal_new: true,
    telegram_appeal_overdue: true,
    telegram_appeal_escalated: true,
  });
  const [pushSupported, setPushSupported] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [telegramConnecting, setTelegramConnecting] = useState(false);

  useEffect(() => {
    checkAuth();
    checkPushSupport();
  }, []);

  async function checkAuth() {
    const { user } = await getCurrentUser();
    if (!user) {
      router.push('/admin/login');
      return;
    }
    loadSettings(user.id);
  }

  async function checkPushSupport() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setPushSupported(true);
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setPushSubscribed(!!subscription);
      } catch (err) {
        console.error('Push check error:', err);
      }
    }
  }

  async function loadSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings({
          email_enabled: data.email_enabled ?? true,
          email_appeal_status: data.email_appeal_status ?? true,
          email_appeal_assigned: data.email_appeal_assigned ?? true,
          email_appeal_comment: data.email_appeal_comment ?? true,
          email_appeal_new: data.email_appeal_new ?? true,
          email_appeal_overdue: data.email_appeal_overdue ?? true,
          email_appeal_escalated: data.email_appeal_escalated ?? true,
          email_daily_summary: data.email_daily_summary ?? false,
          push_enabled: data.push_enabled ?? false,
          push_appeal_status: data.push_appeal_status ?? true,
          push_appeal_assigned: data.push_appeal_assigned ?? true,
          push_appeal_comment: data.push_appeal_comment ?? true,
          push_appeal_new: data.push_appeal_new ?? true,
          push_appeal_overdue: data.push_appeal_overdue ?? true,
          push_appeal_escalated: data.push_appeal_escalated ?? true,
          telegram_enabled: data.telegram_enabled ?? false,
          telegram_chat_id: data.telegram_chat_id ?? null,
          telegram_username: data.telegram_username ?? null,
          telegram_appeal_status: data.telegram_appeal_status ?? true,
          telegram_appeal_assigned: data.telegram_appeal_assigned ?? true,
          telegram_appeal_comment: data.telegram_appeal_comment ?? true,
          telegram_appeal_new: data.telegram_appeal_new ?? true,
          telegram_appeal_overdue: data.telegram_appeal_overdue ?? true,
          telegram_appeal_escalated: data.telegram_appeal_escalated ?? true,
        });
        setPushSubscribed(!!data.push_subscription);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const { user } = await getCurrentUser();
      if (!user) {
        toast.error('Необходимо войти в систему');
        return;
      }

      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        toast.error('Ошибка при сохранении настроек');
        return;
      }

      toast.success('Настройки сохранены');
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  }

  async function connectTelegram() {
    setTelegramConnecting(true);
    try {
      // Открываем инструкцию для подключения Telegram
      const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'oss_dvfu_bot';
      const botUrl = `https://t.me/${botUsername}`;
      
      toast.info(
        `Откройте бота ${botUsername} в Telegram и отправьте команду /start для подключения уведомлений`,
        { duration: 5000 }
      );
      
      // Открываем бота в новой вкладке
      window.open(botUrl, '_blank');
      
      // Показываем инструкцию
      setTimeout(() => {
        alert(
          `Инструкция по подключению Telegram:\n\n` +
          `1. Откройте бота @${botUsername} в Telegram\n` +
          `2. Отправьте команду /start\n` +
          `3. Бот автоматически подключит ваш аккаунт\n` +
          `4. Вернитесь на эту страницу и обновите настройки`
        );
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при подключении Telegram');
    } finally {
      setTelegramConnecting(false);
    }
  }

  async function subscribeToPush() {
    if (!pushSupported) {
      toast.error('Push-уведомления не поддерживаются вашим браузером');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Разрешение на уведомления не получено');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      const { user } = await getCurrentUser();
      if (!user) return;

      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          push_enabled: true,
          push_subscription: subscription,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        toast.error('Ошибка при сохранении подписки');
        return;
      }

      setPushSubscribed(true);
      setSettings({ ...settings, push_enabled: true });
      toast.success('Push-уведомления включены');
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при подписке на push');
    }
  }

  async function unsubscribeFromPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      const { user } = await getCurrentUser();
      if (!user) return;

      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          push_enabled: false,
          push_subscription: null,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        toast.error('Ошибка при отписке');
        return;
      }

      setPushSubscribed(false);
      setSettings({ ...settings, push_enabled: false });
      toast.success('Push-уведомления отключены');
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при отписке');
    }
  }

  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center text-white/50">Загрузка...</div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2 light:text-gray-900">Настройки уведомлений</h1>
        <p className="text-white/70 light:text-gray-600">
          Настройте, как вы хотите получать уведомления об обращениях и других событиях.
        </p>
      </div>

      <div className="space-y-6">
        {/* Email уведомления */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6 light:bg-white light:border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1 light:text-gray-900">Email уведомления</h2>
              <p className="text-sm text-white/60 light:text-gray-600">Получайте уведомления на почту</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, email_enabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-oss-red"></div>
            </label>
          </div>

          {settings.email_enabled && (
            <div className="space-y-3 mt-4 pl-4 border-l-2 border-white/10 light:border-gray-200">
              <NotificationCheckbox
                label="Изменение статуса обращения"
                checked={settings.email_appeal_status}
                onChange={(checked) => setSettings({ ...settings, email_appeal_status: checked })}
              />
              <NotificationCheckbox
                label="Назначение обращения на вас"
                checked={settings.email_appeal_assigned}
                onChange={(checked) => setSettings({ ...settings, email_appeal_assigned: checked })}
              />
              <NotificationCheckbox
                label="Новые комментарии к обращениям"
                checked={settings.email_appeal_comment}
                onChange={(checked) => setSettings({ ...settings, email_appeal_comment: checked })}
              />
              <NotificationCheckbox
                label="Новые обращения в вашем направлении"
                checked={settings.email_appeal_new}
                onChange={(checked) => setSettings({ ...settings, email_appeal_new: checked })}
              />
              <NotificationCheckbox
                label="Просроченные обращения"
                checked={settings.email_appeal_overdue}
                onChange={(checked) => setSettings({ ...settings, email_appeal_overdue: checked })}
              />
              <NotificationCheckbox
                label="Эскалация обращений"
                checked={settings.email_appeal_escalated}
                onChange={(checked) => setSettings({ ...settings, email_appeal_escalated: checked })}
              />
              <NotificationCheckbox
                label="Ежедневная сводка"
                checked={settings.email_daily_summary}
                onChange={(checked) => setSettings({ ...settings, email_daily_summary: checked })}
              />
            </div>
          )}
        </section>

        {/* Push уведомления */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6 light:bg-white light:border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1 light:text-gray-900">Push уведомления</h2>
              <p className="text-sm text-white/60 light:text-gray-600">
                Получайте уведомления прямо в браузере
                {!pushSupported && ' (не поддерживается вашим браузером)'}
              </p>
            </div>
            {pushSupported && (
              <div className="flex gap-2">
                {pushSubscribed ? (
                  <button
                    onClick={unsubscribeFromPush}
                    className="px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition"
                  >
                    Отключить
                  </button>
                ) : (
                  <button
                    onClick={subscribeToPush}
                    className="px-4 py-2 rounded-lg border border-green-500/40 text-green-400 hover:bg-green-500/10 transition"
                  >
                    Включить
                  </button>
                )}
              </div>
            )}
          </div>

          {pushSupported && pushSubscribed && (
            <div className="space-y-3 mt-4 pl-4 border-l-2 border-white/10 light:border-gray-200">
              <NotificationCheckbox
                label="Изменение статуса обращения"
                checked={settings.push_appeal_status}
                onChange={(checked) => setSettings({ ...settings, push_appeal_status: checked })}
              />
              <NotificationCheckbox
                label="Назначение обращения на вас"
                checked={settings.push_appeal_assigned}
                onChange={(checked) => setSettings({ ...settings, push_appeal_assigned: checked })}
              />
              <NotificationCheckbox
                label="Новые комментарии к обращениям"
                checked={settings.push_appeal_comment}
                onChange={(checked) => setSettings({ ...settings, push_appeal_comment: checked })}
              />
              <NotificationCheckbox
                label="Новые обращения в вашем направлении"
                checked={settings.push_appeal_new}
                onChange={(checked) => setSettings({ ...settings, push_appeal_new: checked })}
              />
              <NotificationCheckbox
                label="Просроченные обращения"
                checked={settings.push_appeal_overdue}
                onChange={(checked) => setSettings({ ...settings, push_appeal_overdue: checked })}
              />
              <NotificationCheckbox
                label="Эскалация обращений"
                checked={settings.push_appeal_escalated}
                onChange={(checked) => setSettings({ ...settings, push_appeal_escalated: checked })}
              />
            </div>
          )}
        </section>

        {/* Telegram уведомления */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6 light:bg-white light:border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1 light:text-gray-900">Telegram уведомления</h2>
              <p className="text-sm text-white/60 light:text-gray-600">
                Получайте уведомления в Telegram
                {settings.telegram_username && ` (@${settings.telegram_username})`}
              </p>
            </div>
            <div className="flex gap-2">
              {settings.telegram_chat_id ? (
                <button
                  onClick={() => {
                    setSettings({
                      ...settings,
                      telegram_enabled: !settings.telegram_enabled,
                    });
                  }}
                  className={`px-4 py-2 rounded-lg border transition ${
                    settings.telegram_enabled
                      ? 'border-green-500/40 text-green-400 hover:bg-green-500/10'
                      : 'border-gray-500/40 text-gray-400 hover:bg-gray-500/10'
                  }`}
                >
                  {settings.telegram_enabled ? 'Включено' : 'Отключено'}
                </button>
              ) : (
                <button
                  onClick={connectTelegram}
                  disabled={telegramConnecting}
                  className="px-4 py-2 rounded-lg border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 transition disabled:opacity-50"
                >
                  {telegramConnecting ? 'Подключение...' : 'Подключить'}
                </button>
              )}
            </div>
          </div>

          {settings.telegram_chat_id && settings.telegram_enabled && (
            <div className="space-y-3 mt-4 pl-4 border-l-2 border-white/10 light:border-gray-200">
              <NotificationCheckbox
                label="Изменение статуса обращения"
                checked={settings.telegram_appeal_status}
                onChange={(checked) => setSettings({ ...settings, telegram_appeal_status: checked })}
              />
              <NotificationCheckbox
                label="Назначение обращения на вас"
                checked={settings.telegram_appeal_assigned}
                onChange={(checked) => setSettings({ ...settings, telegram_appeal_assigned: checked })}
              />
              <NotificationCheckbox
                label="Новые комментарии к обращениям"
                checked={settings.telegram_appeal_comment}
                onChange={(checked) => setSettings({ ...settings, telegram_appeal_comment: checked })}
              />
              <NotificationCheckbox
                label="Новые обращения в вашем направлении"
                checked={settings.telegram_appeal_new}
                onChange={(checked) => setSettings({ ...settings, telegram_appeal_new: checked })}
              />
              <NotificationCheckbox
                label="Просроченные обращения"
                checked={settings.telegram_appeal_overdue}
                onChange={(checked) => setSettings({ ...settings, telegram_appeal_overdue: checked })}
              />
              <NotificationCheckbox
                label="Эскалация обращений"
                checked={settings.telegram_appeal_escalated}
                onChange={(checked) => setSettings({ ...settings, telegram_appeal_escalated: checked })}
              />
            </div>
          )}
        </section>

        <div className="flex gap-4">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-oss-red font-semibold hover:bg-oss-red/90 transition disabled:opacity-50 text-white"
          >
            {saving ? 'Сохранение...' : 'Сохранить настройки'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white transition light:border-gray-300 light:text-gray-700 light:hover:text-gray-900"
          >
            Отмена
          </button>
        </div>
      </div>
    </main>
  );
}

function NotificationCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-white/20 bg-white/10 text-oss-red focus:ring-oss-red light:border-gray-300"
      />
      <span className="text-white/90 light:text-gray-700">{label}</span>
    </label>
  );
}
