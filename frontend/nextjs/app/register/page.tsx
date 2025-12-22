'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { validatePassword } from '../../lib/passwordValidation';
import { getRecaptchaToken, verifyRecaptchaToken } from '../../lib/captcha';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member' as 'member' | 'lead',
    directionId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [directions, setDirections] = useState<any[]>([]);

  React.useEffect(() => {
    loadDirections();
  }, []);

  async function loadDirections() {
    try {
      const { data } = await supabase
        .from('directions')
        .select('id, title, slug')
        .eq('is_active', true)
        .order('title');
      
      if (data) {
        setDirections(data);
      }
    } catch (err) {
      console.error('Error loading directions:', err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Валидация пароля с проверкой сложности
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.errors[0] || 'Пароль не соответствует требованиям');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    // Валидация email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError('Неверный формат email');
      return;
    }

    setLoading(true);

    try {
      // Проверка reCAPTCHA
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        try {
          const captchaToken = await getRecaptchaToken('register');
          const captchaValid = await verifyRecaptchaToken(captchaToken);
          if (!captchaValid) {
            setError('Проверка безопасности не пройдена. Попробуйте еще раз.');
            setLoading(false);
            return;
          }
        } catch (captchaError) {
          console.error('reCAPTCHA error:', captchaError);
          if (process.env.NODE_ENV === 'production') {
            setError('Ошибка проверки безопасности. Обновите страницу.');
            setLoading(false);
            return;
          }
        }
      }

      // Регистрация через Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
        },
      });

      if (signUpError) {
        // Унифицированное сообщение (не раскрывать, существует ли email)
        // Всегда показывать успех, даже если email уже существует
        // Это защищает от email enumeration
        if (signUpError.message?.includes('already registered') || 
            signUpError.message?.includes('User already registered')) {
          // Не показывать ошибку, показать успех (защита от enumeration)
          setSuccess(true);
          setLoading(false);
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }
        
        // Для других ошибок показывать унифицированное сообщение
        setError('Ошибка регистрации. Попробуйте позже.');
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Не удалось создать пользователя');
        setLoading(false);
        return;
      }

      // Назначить роль (требует подтверждения администратором)
      if (formData.role && formData.directionId) {
        const { error: roleError } = await supabase.from('user_roles').insert({
          user_id: authData.user.id,
          role: formData.role,
          direction_id: formData.directionId || null,
        });

        if (roleError) {
          console.error('Role assignment error:', roleError);
          // Не критично, можно назначить позже
        }
      }

      // Создать настройки уведомлений
      const { error: settingsError } = await supabase.from('notification_settings').insert({
        user_id: authData.user.id,
        email_enabled: true,
        push_enabled: false,
        telegram_enabled: false,
      });

      if (settingsError) {
        console.error('Settings error:', settingsError);
        // Не критично
      }

      setSuccess(true);
      setLoading(false);

      // Логирование регистрации
      await logRegistration(formData.email, formData.role);

      // Перенаправление через 3 секунды
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Неожиданная ошибка при регистрации');
      setLoading(false);
    }
  }

  async function logRegistration(email: string, role: string) {
    try {
      await fetch('/api/security/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'registration',
          email: email.substring(0, 3) + '***',
          role,
        }),
      });
    } catch (err) {
      console.error('Log error:', err);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-oss-dark px-6 py-12">
        <div className="max-w-md w-full">
          <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-2xl font-semibold mb-4">Регистрация успешна!</h1>
            <p className="text-white/70 mb-6">
              Ваш аккаунт создан. После подтверждения администратором вы сможете войти в систему.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 rounded-xl bg-oss-red hover:bg-oss-red/90 text-white font-medium transition"
            >
              Перейти к входу
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-oss-dark px-6 py-12">
      <div className="max-w-md w-full">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2">Регистрация</h1>
            <p className="text-white/70">
              Для членов ОСС ДВФУ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ФИО</label>
              <input
                type="text"
                required
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition"
                placeholder="Иванов Иван Иванович"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition"
                placeholder="Минимум 8 символов"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div className="text-xs text-white/50 mt-1">
                Минимум 8 символов, рекомендуется использовать буквы, цифры и специальные символы
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Подтвердите пароль</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Роль</label>
              <select
                required
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white focus:outline-none focus:border-oss-red transition"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'member' | 'lead' })}
              >
                <option value="member">Член ОСС</option>
                <option value="lead">Руководитель направления</option>
              </select>
            </div>

            {formData.role === 'lead' && (
              <div>
                <label className="block text-sm font-medium mb-2">Направление</label>
                <select
                  required
                  className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white focus:outline-none focus:border-oss-red transition"
                  value={formData.directionId}
                  onChange={(e) => setFormData({ ...formData, directionId: e.target.value })}
                >
                  <option value="">Выберите направление</option>
                  {directions.map((dir) => (
                    <option key={dir.id} value={dir.id}>
                      {dir.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-oss-red py-3 font-semibold hover:bg-oss-red/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link
              href="/login"
              className="text-sm text-white/60 hover:text-white/80 transition"
            >
              Уже есть аккаунт? Войти
            </Link>
          </div>

          <div className="mt-4 text-xs text-white/40 text-center">
            <p>Регистрация требует подтверждения администратором.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

