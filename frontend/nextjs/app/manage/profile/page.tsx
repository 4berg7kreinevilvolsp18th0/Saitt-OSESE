'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { getCurrentUser, getUserRoles, signOut, type UserRoleWithDirection } from '../../../lib/auth';
import { useToast } from '../../../components/ToastProvider';

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<UserRoleWithDirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Статистика
  const [stats, setStats] = useState({
    totalAppeals: 0,
    myAppeals: 0,
    assignedToMe: 0,
    closedAppeals: 0,
  });
  
  // Форма изменения пароля
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { user: currentUser } = await getCurrentUser();
    if (!currentUser) {
      router.push('/admin/login');
      return;
    }

    setUser(currentUser);
    const userRoles = await getUserRoles();
    setRoles(userRoles);

    if (userRoles.length === 0) {
      router.push('/admin/login');
      return;
    }

    await loadStats(currentUser.id);
    setLoading(false);
  }

  async function loadStats(userId: string) {
    try {
      // Всего обращений (если board/staff)
      const { data: allAppeals } = await supabase
        .from('appeals')
        .select('id', { count: 'exact', head: true });

      // Назначенные мне
      const { data: assignedAppeals } = await supabase
        .from('appeals')
        .select('id', { count: 'exact', head: true })
        .eq('assigned_to', userId);

      // Закрытые
      const { data: closedAppeals } = await supabase
        .from('appeals')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'closed');

      setStats({
        totalAppeals: allAppeals?.length || 0,
        myAppeals: assignedAppeals?.length || 0,
        assignedToMe: assignedAppeals?.length || 0,
        closedAppeals: closedAppeals?.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async function handleChangePassword() {
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      toast.error('Новый пароль должен быть не менее 8 символов');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    setChangingPassword(true);
    try {
      // Обновить пароль через Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) {
        toast.error('Ошибка при изменении пароля: ' + error.message);
        return;
      }

      toast.success('Пароль успешно изменен');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message);
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center">Загрузка...</div>
      </main>
    );
  }

  const roleLabels: Record<string, string> = {
    member: 'Член ОСС',
    lead: 'Руководитель направления',
    board: 'Руководство ОСС',
    staff: 'Аппарат',
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Личный кабинет</h1>
          <p className="mt-2 text-white/70">
            Управление профилем и настройками аккаунта
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition"
        >
          ← Назад
        </Link>
      </div>

      {/* Информация о пользователе */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4">Информация о пользователе</h2>
        
        <div className="space-y-4">
          <div>
            <div className="text-sm text-white/60 mb-1">Email</div>
            <div className="font-medium">{user?.email}</div>
          </div>

          <div>
            <div className="text-sm text-white/60 mb-1">ID пользователя</div>
            <div className="font-mono text-sm text-white/80">{user?.id}</div>
          </div>

          <div>
            <div className="text-sm text-white/60 mb-2">Роли</div>
            <div className="flex flex-wrap gap-2">
              {roles.length > 0 ? (
                roles.map((r, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-white/10 text-xs text-white/80"
                  >
                    {roleLabels[r.role] || r.role}
                    {r.directionId && ' (направление)'}
                  </span>
                ))
              ) : (
                <span className="text-white/60 text-sm">Нет ролей</span>
              )}
            </div>
          </div>

          {user?.created_at && (
            <div>
              <div className="text-sm text-white/60 mb-1">Дата регистрации</div>
              <div className="text-white/80">
                {new Date(user.created_at).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Статистика */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4">Статистика</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/60 mb-1">Всего обращений</div>
            <div className="text-2xl font-bold">{stats.totalAppeals}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/60 mb-1">Назначено мне</div>
            <div className="text-2xl font-bold">{stats.assignedToMe}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/60 mb-1">Закрыто</div>
            <div className="text-2xl font-bold">{stats.closedAppeals}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/60 mb-1">Активных</div>
            <div className="text-2xl font-bold">
              {stats.totalAppeals - stats.closedAppeals}
            </div>
          </div>
        </div>
      </div>

      {/* Изменение пароля */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4">Изменить пароль</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-2">
              Текущий пароль
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              placeholder="Введите текущий пароль"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">
              Новый пароль
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              placeholder="Минимум 8 символов"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">
              Подтвердите новый пароль
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              placeholder="Повторите новый пароль"
            />
          </div>

          <button
            onClick={handleChangePassword}
            disabled={changingPassword || !passwordForm.newPassword}
            className="px-6 py-2 rounded-xl bg-oss-red hover:bg-oss-red/80 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changingPassword ? 'Сохранение...' : 'Изменить пароль'}
          </button>
        </div>
      </div>

      {/* Быстрые ссылки */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4">Настройки</h2>
        
        <div className="space-y-3">
          <Link
            href="/admin/settings/notifications"
            className="block px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <div className="font-medium">Уведомления</div>
            <div className="text-sm text-white/60 mt-1">
              Настройки email, push и Telegram уведомлений
            </div>
          </Link>
        </div>
      </div>

      {/* Выход */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-400">Опасная зона</h2>
        
        <button
          onClick={handleSignOut}
          className="px-6 py-2 rounded-xl border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition"
        >
          Выйти из аккаунта
        </button>
      </div>
    </main>
  );
}

