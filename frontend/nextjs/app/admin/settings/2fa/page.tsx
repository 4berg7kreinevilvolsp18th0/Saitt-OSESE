'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../../../lib/auth';
import { supabase } from '../../../../lib/supabaseClient';
import { verify2FAToken, is2FAEnabled } from '../../../../lib/2fa';
import QRCode from 'qrcode';

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const [qrCodeURL, setQrCodeURL] = useState<string>('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [verificationToken, setVerificationToken] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { user: currentUser } = await getCurrentUser();
      if (!currentUser) {
        router.push('/admin/login');
        return;
      }
      setUser(currentUser);

      // Проверить статус 2FA
      const isEnabled = await is2FAEnabled(currentUser.id);
      setEnabled(isEnabled);
      setLoading(false);
    }
    loadUser();
  }, [router]);

  async function handleSetup() {
    setSettingUp(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to setup 2FA');
      }

      const data = await response.json();
      setQrCodeURL(data.qrCodeURL);

      // Генерация QR кода изображения
      if (QRCode) {
        const qrDataURL = await QRCode.toDataURL(data.qrCodeURL);
        setQrCodeDataURL(qrDataURL);
      } else {
        // Fallback: показать URL для ручного ввода
        setQrCodeDataURL('');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка настройки 2FA');
    } finally {
      setSettingUp(false);
    }
  }

  async function handleVerify() {
    if (!verificationToken) {
      setError('Введите код из приложения');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: verificationToken,
          enable: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid token');
      }

      const data = await response.json();
      setBackupCodes(data.backupCodes || []);
      setEnabled(true);
      setSuccess('2FA успешно включена! Сохраните резервные коды.');
      setQrCodeURL('');
      setQrCodeDataURL('');
      setVerificationToken('');
    } catch (err: any) {
      setError(err.message || 'Ошибка верификации');
    }
  }

  async function handleDisable() {
    if (!confirm('Вы уверены, что хотите отключить 2FA? Это снизит безопасность вашего аккаунта.')) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('user_2fa')
        .update({ enabled: false })
        .eq('user_id', user.id);

      if (error) throw error;

      setEnabled(false);
      setSuccess('2FA отключена');
    } catch (err: any) {
      setError(err.message || 'Ошибка отключения 2FA');
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center">Загрузка...</div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Двухфакторная аутентификация (2FA)</h1>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-sm text-green-400">
          {success}
        </div>
      )}

      {backupCodes.length > 0 && (
        <div className="mb-6 rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">
            ⚠️ Сохраните резервные коды!
          </h2>
          <p className="text-white/70 mb-4">
            Эти коды можно использовать для входа, если у вас нет доступа к приложению-аутентификатору.
            Сохраните их в безопасном месте.
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
            {backupCodes.map((code, i) => (
              <div key={i} className="p-2 bg-white/10 rounded text-center">
                {code}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        {!enabled ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Настройка 2FA</h2>
            <p className="text-white/70 mb-6">
              Двухфакторная аутентификация добавляет дополнительный уровень безопасности к вашему аккаунту.
              Вам понадобится приложение-аутентификатор (Google Authenticator, Authy, Microsoft Authenticator).
            </p>

            {!qrCodeURL ? (
              <button
                onClick={handleSetup}
                disabled={settingUp}
                className="px-6 py-3 rounded-xl bg-oss-red hover:bg-oss-red/90 text-white font-semibold transition disabled:opacity-50"
              >
                {settingUp ? 'Настройка...' : 'Начать настройку'}
              </button>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Шаг 1: Отсканируйте QR код</h3>
                  <p className="text-white/70 mb-4">
                    Откройте приложение-аутентификатор и отсканируйте этот QR код:
                  </p>
                  {qrCodeDataURL && (
                    <div className="inline-block p-4 bg-white rounded-lg">
                      <img src={qrCodeDataURL} alt="QR Code" className="w-64 h-64" />
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Шаг 2: Введите код подтверждения</h3>
                  <p className="text-white/70 mb-4">
                    Введите 6-значный код из приложения для подтверждения:
                  </p>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      className="flex-1 rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition"
                      value={verificationToken}
                      onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, ''))}
                    />
                    <button
                      onClick={handleVerify}
                      className="px-6 py-3 rounded-xl bg-oss-red hover:bg-oss-red/90 text-white font-semibold transition"
                    >
                      Подтвердить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">2FA включена</h2>
                <p className="text-white/70">
                  Ваш аккаунт защищен двухфакторной аутентификацией.
                </p>
              </div>
              <div className="text-2xl">✅</div>
            </div>

            <button
              onClick={handleDisable}
              className="px-6 py-3 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition"
            >
              Отключить 2FA
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

