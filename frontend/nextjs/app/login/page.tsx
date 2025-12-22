'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '../../lib/auth';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockUntil, setBlockUntil] = useState<Date | null>(null);

  useEffect(() => {
    // Проверка блокировки из localStorage
    const blocked = localStorage.getItem('login_blocked');
    if (blocked) {
      const blockTime = new Date(blocked);
      if (blockTime > new Date()) {
        setIsBlocked(true);
        setBlockUntil(blockTime);
      } else {
        localStorage.removeItem('login_blocked');
        localStorage.removeItem('login_attempts');
      }
    }

    // Проверка попыток входа
    const attempts = parseInt(localStorage.getItem('login_attempts') || '0');
    setLoginAttempts(attempts);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Проверка блокировки
    if (isBlocked && blockUntil && blockUntil > new Date()) {
      const minutesLeft = Math.ceil((blockUntil.getTime() - Date.now()) / 60000);
      setError(`Слишком много неудачных попыток. Попробуйте через ${minutesLeft} минут.`);
      return;
    }

    setLoading(true);

    try {
      // Проверка rate limit на сервере
      const rateLimitCheck = await fetch('/api/auth/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!rateLimitCheck.ok) {
        const rateLimitData = await rateLimitCheck.json();
        if (rateLimitData.retryAfter) {
          const minutes = Math.ceil(rateLimitData.retryAfter / 60);
          setError(`Слишком много попыток. Попробуйте через ${minutes} минут.`);
          setLoading(false);
          return;
        }
      }

      // Логирование попытки входа
      await logLoginAttempt(email, 'attempt');

      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        // Увеличить счетчик попыток
        const attempts = parseInt(localStorage.getItem('login_attempts') || '0') + 1;
        localStorage.setItem('login_attempts', attempts.toString());
        setLoginAttempts(attempts);

        // Блокировка после 5 неудачных попыток
        // ВАЖНО: Это клиентская блокировка, легко обходится
        // Реальная блокировка должна быть на сервере (через rate limit API)
        if (attempts >= 5) {
          const blockTime = new Date(Date.now() + 15 * 60 * 1000); // 15 минут
          localStorage.setItem('login_blocked', blockTime.toISOString());
          setIsBlocked(true);
          setBlockUntil(blockTime);
          
          // Логирование блокировки
          await logLoginAttempt(email, 'blocked');
          
          setError('Слишком много неудачных попыток. Доступ заблокирован на 15 минут.');
          setLoading(false);
          return;
        }

        // Логирование неудачной попытки
        await logLoginAttempt(email, 'failed', signInError.message);

        // Унифицированное сообщение об ошибке (не раскрывать информацию)
        // Всегда одинаковое сообщение, независимо от причины
        let errorMessage = 'Неверный email или пароль';
        
        // Только для внутренних ошибок показываем детали
        if (signInError.message?.includes('Too many requests')) {
          errorMessage = 'Слишком много запросов. Попробуйте позже.';
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Успешный вход - очистить счетчики
      localStorage.removeItem('login_attempts');
      localStorage.removeItem('login_blocked');
      
      // Логирование успешного входа
      await logLoginAttempt(email, 'success');

      // Перенаправление на скрытую админ-панель
      router.push('/manage');
      router.refresh();
    } catch (err: any) {
      await logLoginAttempt(email, 'error', err.message);
      setError(err.message || 'Неожиданная ошибка при входе');
      setLoading(false);
    }
  }

  async function logLoginAttempt(email: string, status: string, details?: string) {
    try {
      // Логирование в БД (если есть таблица security_log)
      await fetch('/api/security/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'login_attempt',
          email: email.substring(0, 3) + '***', // Частично скрытый email
          status,
          details,
          ip: 'client', // IP будет получен на сервере из заголовков
          user_agent: navigator.userAgent,
        }),
      });
    } catch (err) {
      // Игнорируем ошибки логирования
      console.error('Log error:', err);
    }
  }

  // IP будет получен на сервере из заголовков
  // Не нужно делать внешний запрос - это медленно и ненадежно

  return (
    <main className="min-h-screen flex items-center justify-center bg-oss-dark px-6 py-12">
      <div className="max-w-md w-full">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2">Вход в систему</h1>
            <p className="text-white/70">
              Для членов ОСС ДВФУ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isBlocked}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isBlocked}
              />
            </div>

            {error && (
              <div className={`rounded-xl border p-4 text-sm ${
                error.includes('заблокирован') 
                  ? 'border-red-500/40 bg-red-500/10 text-red-400'
                  : 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
              }`}>
                {error}
              </div>
            )}

            {/* Не показывать количество попыток - это помогает атакующим */}

            <button
              type="submit"
              disabled={loading || isBlocked}
              className="w-full rounded-xl bg-oss-red py-3 font-semibold hover:bg-oss-red/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link
              href="/register"
              className="text-sm text-white/60 hover:text-white/80 transition"
            >
              Нет аккаунта? Зарегистрироваться
            </Link>
          </div>

          <div className="mt-4 text-xs text-white/40 text-center">
            <p>Для получения доступа обратитесь к руководству ОСС.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

