'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, getUserRoles, signOut, type UserRoleWithDirection } from '../../lib/auth';

export default function ManagePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<UserRoleWithDirection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { user: currentUser } = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUser(currentUser);
      const userRoles = await getUserRoles();

      if (userRoles.length === 0) {
        router.push('/login');
        return;
      }

      setRoles(userRoles);
      setLoading(false);
    }

    checkAuth();
  }, [router]);

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
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
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Управление</h1>
          <p className="mt-2 text-white/70">
            Панель управления ОСС ДВФУ
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition"
        >
          Выйти
        </button>
      </div>

      {user && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60 mb-2">Вы вошли как</div>
          <div className="font-medium">{user.email}</div>
          {roles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {roles.map((r, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-white/10 text-xs text-white/80"
                >
                  {roleLabels[r.role] || r.role}
                  {r.directionId && ' (направление)'}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/manage/appeals"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
        >
          <div className="text-lg font-semibold">Обращения</div>
          <div className="mt-2 text-white/70">Канбан и обработка обращений.</div>
        </Link>
        <Link
          href="/manage/dashboards"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
        >
          <div className="text-lg font-semibold">Дашборды</div>
          <div className="mt-2 text-white/70">Нагрузка, очередь, управленческие метрики.</div>
        </Link>
        <Link
          href="/manage/content"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
        >
          <div className="text-lg font-semibold">Контент</div>
          <div className="mt-2 text-white/70">Управление новостями, гайдами и FAQ.</div>
        </Link>
        <Link
          href="/manage/settings/notifications"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
        >
          <div className="text-lg font-semibold">Уведомления</div>
          <div className="mt-2 text-white/70">Настройки email и push уведомлений.</div>
        </Link>
        <Link
          href="/manage/dashboards/schools"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
        >
          <div className="text-lg font-semibold">Статистика по школам</div>
          <div className="mt-2 text-white/70">Распределение обращений по школам ДВФУ.</div>
        </Link>
        <Link
          href="/manage/profile"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
        >
          <div className="text-lg font-semibold">Личный кабинет</div>
          <div className="mt-2 text-white/70">Профиль, статистика, настройки аккаунта.</div>
        </Link>
      </div>
    </main>
  );
}

