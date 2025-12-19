'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { getCurrentUser } from '../../../../lib/auth';
import { useToast } from '../../../../components/ToastProvider';

interface NotificationSettings {
  id?: string;
  email_enabled: boolean;
  email_appeal_status: boolean;
  email_appeal_assigned: boolean;
  email_appeal_comment: boolean;
  email_daily_summary: boolean;
  push_enabled: boolean;
  push_appeal_status: boolean;
  push_appeal_assigned: boolean;
  push_appeal_comment: boolean;
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
    email_daily_summary: false,
    push_enabled: false,
    push_appeal_status: true,
    push_appeal_assigned: true,
    push_appeal_comment: true,
  });
  const [pushSupported, setPushSupported] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);

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
      // Проверяем, подписан ли пользователь на push
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setPushSubscribed(!!subscription);
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
        // PGRST116 = no rows returned
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings({
          email_enabled: data.email_enabled ?? true,
          email_appeal_status: data.email_appeal_status ?? true,
          email_appeal_assigned: data.email_appeal_assigned ?? true,
          email_appeal_comment: data.email_appeal_comment ?? true,
          email_daily_summary: data.email_daily_summary ?? false,
          push_enabled: data.push_enabled ?? false,
          push_appeal_status: data.push_appeal_status ?? true,
          push_appeal_assigned: data.push_appeal_assigned ?? true,
          push_appeal_comment: data.push_appeal_comment ?? true,
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

  async function subscribeToPush() {
    if (!pushSupported) {
      toast.error('Push-уведомления не поддерживаются вашим браузером');
      return;
    }

    try {
      // Регистрируем Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Запрашиваем разрешение
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Разрешение на уведомления не получено');
        return;
      }

      // Подписываемся на push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      // Сохраняем подписку
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
        <h1 className="text-3xl font-semibold mb-2">Настройки уведомлений</h1>
        <p className="text-white/70">
          Настройте, как вы хотите получать уведомления об обращениях и других событиях.
        </p>
      </div>

      <div className="space-y-6">
        {/* Email уведомления */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Email уведомления</h2>
              <p className="text-sm text-white/60">Получайте уведомления на почту</p>
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
            <div className="space-y-3 mt-4 pl-4 border-l-2 border-white/10">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email_appeal_status}
                  onChange={(e) =>
                    setSettings({ ...settings, email_appeal_status: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-oss-red focus:ring-oss-red"
                />
                <span>Изменение статуса обращения</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email_appeal_assigned}
                  onChange={(e) =>
                    setSettings({ ...settings, email_appeal_assigned: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-oss-red focus:ring-oss-red"
                />
                <span>Назначение обращения на вас</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email_appeal_comment}
                  onChange={(e) =>
                    setSettings({ ...settings, email_appeal_comment: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-oss-red focus:ring-oss-red"
                />
                <span>Новые комментарии к обращениям</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email_daily_summary}
                  onChange={(e) =>
                    setSettings({ ...settings, email_daily_summary: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-oss-red focus:ring-oss-red"
                />
                <span>Ежедневная сводка</span>
              </label>
            </div>
          )}
        </section>

        {/* Push уведомления */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Push уведомления</h2>
              <p className="text-sm text-white/60">
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
            <div className="space-y-3 mt-4 pl-4 border-l-2 border-white/10">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.push_appeal_status}
                  onChange={(e) =>
                    setSettings({ ...settings, push_appeal_status: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-oss-red focus:ring-oss-red"
                />
                <span>Изменение статуса обращения</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.push_appeal_assigned}
                  onChange={(e) =>
                    setSettings({ ...settings, push_appeal_assigned: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-oss-red focus:ring-oss-red"
                />
                <span>Назначение обращения на вас</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.push_appeal_comment}
                  onChange={(e) =>
                    setSettings({ ...settings, push_appeal_comment: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-oss-red focus:ring-oss-red"
                />
                <span>Новые комментарии к обращениям</span>
              </label>
            </div>
          )}
        </section>

        <div className="flex gap-4">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-oss-red font-semibold hover:bg-oss-red/90 transition disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить настройки'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white transition"
          >
            Отмена
          </button>
        </div>
      </div>
    </main>
  );
}

