'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { useToast } from '../../../components/ToastProvider';
import { getCurrentUser } from '../../../lib/auth';

export default function ManageStatsPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const [total, setTotal] = useState('');
  const [newCount, setNewCount] = useState('');
  const [inProgress, setInProgress] = useState('');
  const [waiting, setWaiting] = useState('');
  const [closed, setClosed] = useState('');
  const [createdToday, setCreatedToday] = useState('');
  const [closedToday, setClosedToday] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { user } = await getCurrentUser();
      if (!user) {
        router.push('/manage/login');
        return;
      }

      // Проверяем роль пользователя
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      const allowedRoles = ['member', 'lead', 'board', 'staff'];
      if (!roles || !allowedRoles.includes(roles.role)) {
        toast.error('У вас нет доступа к этой странице');
        router.push('/manage');
        return;
      }

      setAuthorized(true);
      loadTodayStats();
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/manage/login');
    } finally {
      setLoading(false);
    }
  }

  async function loadTodayStats() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('statistics')
        .select('*')
        .eq('period', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && data.data) {
        const stats = data.data;
        setTotal(String(stats.total || ''));
        setNewCount(String(stats.by_status?.new || ''));
        setInProgress(String(stats.by_status?.in_progress || ''));
        setWaiting(String(stats.by_status?.waiting || ''));
        setClosed(String(stats.by_status?.closed || ''));
        setCreatedToday(String(stats.created_today || ''));
        setClosedToday(String(stats.closed_today || ''));
      }
    } catch (error) {
      // Нет данных за сегодня - это нормально поэтому не выводим ошибку
      console.log('No stats for today yet');
    }
  }

  async function saveStats() {
    if (!total || !newCount || !inProgress || !waiting || !closed) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    setSaving(true);
    try {
      const { user } = await getCurrentUser();
      if (!user) {
        toast.error('Необходима авторизация');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const statsData = {
        period: today,
        source: 'manual',
        data: {
          total: parseInt(total),
          by_status: {
            new: parseInt(newCount),
            in_progress: parseInt(inProgress),
            waiting: parseInt(waiting),
            closed: parseInt(closed),
          },
          created_today: parseInt(createdToday) || 0,
          closed_today: parseInt(closedToday) || 0,
          timestamp: new Date().toISOString(),
        },
        created_by: user.id,
      };

      // Проверяем, есть ли уже данные за сегодня (manual)
      const { data: existing } = await supabase
        .from('statistics')
        .select('id')
        .eq('period', today)
        .eq('source', 'manual')
        .single();

      if (existing) {
        // Обновляем
        const { error } = await supabase
          .from('statistics')
          .update({
            data: statsData.data,
            created_by: user.id,
          })
          .eq('id', existing.id);

        if (error) throw error;
        toast.success('Статистика обновлена, мой господин!');
      } else {
        // Создаем новую
        const { error } = await supabase
          .from('statistics')
          .insert(statsData);

        if (error) throw error;
        toast.success('Статистика сохранена, мой господин!');
      }

      // Перезагружаем данные показываем член мой господин!
      loadTodayStats();
    } catch (error: any) {
      console.error('Save stats error:', error);
      toast.error(error.message || 'Ошибка при сохранении статистики, мой господин!');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center text-white/50">Загрузка...</div>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Ввод статистики</h1>
        <p className="text-white/70">
          Введите статистику обращений за сегодня. Данные будут отображаться на сайте. Мой господин!
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4">Общая статистика</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Всего обращений <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Создано сегодня
              </label>
              <input
                type="number"
                value={createdToday}
                onChange={(e) => setCreatedToday(e.target.value)}
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Закрыто сегодня
              </label>
              <input
                type="number"
                value={closedToday}
                onChange={(e) => setClosedToday(e.target.value)}
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4">По статусам</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Новые <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={newCount}
                onChange={(e) => setNewCount(e.target.value)}
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                В работе <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={inProgress}
                onChange={(e) => setInProgress(e.target.value)}
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Ожидание <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={waiting}
                onChange={(e) => setWaiting(e.target.value)}
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Закрыто <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={closed}
                onChange={(e) => setClosed(e.target.value)}
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={saveStats}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-oss-red font-semibold hover:bg-oss-red/90 transition disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить статистику'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white"
          >
            Отмена
          </button>
        </div>
      </div>
    </main>
  );
}


