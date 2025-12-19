'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { useToast } from '../../../components/ToastProvider';

export default function AdminRegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'member' as 'member' | 'lead' | 'board' | 'staff',
    directionId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Валидация
    if (formData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
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
        setError(signUpError.message || 'Ошибка регистрации');
        toast.error(signUpError.message || 'Ошибка регистрации');
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Не удалось создать пользователя');
        toast.error('Не удалось создать пользователя');
        setLoading(false);
        return;
      }

      // Создаём запись в user_roles (требует подтверждения от администратора)
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: authData.user.id,
        role: formData.role,
        direction_id: formData.directionId || null,
      });

      if (roleError) {
        console.error('Role assignment error:', roleError);
        // Не критично, роль может быть назначена позже администратором
      }

      // Создаём настройки уведомлений по умолчанию
      const { error: settingsError } = await supabase.from('notification_settings').insert({
        user_id: authData.user.id,
        email_enabled: true,
        email_appeal_status: true,
        email_appeal_assigned: true,
        email_appeal_comment: true,
        push_enabled: false,
      });

      if (settingsError) {
        console.error('Notification settings error:', settingsError);
        // Не критично, настройки можно создать позже
      }

      toast.success('Регистрация успешна! Ожидайте подтверждения от администратора.');
      router.push('/admin/login');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
      toast.error(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-oss-dark px-6 py-12">
      <div className="max-w-md w-full">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-semibold mb-2">Регистрация</h1>
          <p className="text-white/70 mb-8">
            Регистрация для членов ОСС и администраторов. После регистрации требуется подтверждение от руководства.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                ФИО <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                placeholder="Иванов Иван Иванович"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Пароль <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                placeholder="Минимум 8 символов"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Подтвердите пароль <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                required
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Роль <span className="text-red-400">*</span>
              </label>
              <select
                required
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              >
                <option value="member">Член ОСС</option>
                <option value="lead">Руководитель направления</option>
                <option value="board">Руководство ОСС</option>
                <option value="staff">Аппарат</option>
              </select>
            </div>

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
              href="/admin/login"
              className="text-sm text-white/70 hover:text-white transition"
            >
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

