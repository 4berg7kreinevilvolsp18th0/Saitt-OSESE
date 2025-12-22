'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verify2FAToken, getUser2FASecret } from '../../../lib/2fa';

export default function TwoFactorAuthLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Получить user ID из sessionStorage
    const storedUserId = sessionStorage.getItem('2fa_user_id');
    if (!storedUserId) {
      router.push('/login');
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token || token.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }

    if (!userId) {
      setError('Ошибка сессии. Попробуйте войти снова.');
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/2fa/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          token,
        }),
      });

      const data = await response.json();

      if (!data.verified) {
        setError('Неверный код. Попробуйте еще раз.');
        setLoading(false);
        return;
      }

      // Успешная верификация - очистить sessionStorage и перенаправить
      sessionStorage.removeItem('2fa_user_id');
      router.push('/manage');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ошибка верификации');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-oss-dark px-6 py-12">
      <div className="max-w-md w-full">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2">Двухфакторная аутентификация</h1>
            <p className="text-white/70">
              Введите код из приложения-аутентификатора
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Код подтверждения</label>
              <input
                type="text"
                required
                maxLength={6}
                autoComplete="one-time-code"
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition text-center text-2xl tracking-widest"
                placeholder="000000"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || token.length !== 6}
              className="w-full rounded-xl bg-oss-red py-3 font-semibold hover:bg-oss-red/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Проверка...' : 'Подтвердить'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button
              onClick={() => {
                sessionStorage.removeItem('2fa_user_id');
                router.push('/login');
              }}
              className="text-sm text-white/60 hover:text-white/80 transition"
            >
              Вернуться к входу
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

