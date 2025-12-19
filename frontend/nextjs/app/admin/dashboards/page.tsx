'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Row = { status: string; count: number };
type StatusLabel = {
  key: string;
  label: string;
  color: string;
};

const statusLabels: StatusLabel[] = [
  { key: 'new', label: 'Новое', color: '#3B82F6' },
  { key: 'in_progress', label: 'В работе', color: '#F59E0B' },
  { key: 'waiting', label: 'Ждём инфо', color: '#EF4444' },
  { key: 'closed', label: 'Закрыто', color: '#10B981' },
];

export default function AdminDashboards() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    waiting: 0,
    closed: 0,
    avgResponseTime: null as number | null,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('appeals')
          .select('status, created_at, first_response_at, closed_at');

        if (fetchError) {
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        const items = (data as any[]) || [];
        const map = new Map<string, number>();
        for (const it of items) map.set(it.status, (map.get(it.status) || 0) + 1);

        const normalized: Row[] = statusLabels.map((s) => ({
          status: s.label,
          count: map.get(s.key) || 0,
        }));

        setRows(normalized);

        // Вычисляем статистику
        const total = items.length;
        const newCount = map.get('new') || 0;
        const inProgress = map.get('in_progress') || 0;
        const waiting = map.get('waiting') || 0;
        const closed = map.get('closed') || 0;

        // Среднее время ответа (для закрытых обращений)
        const closedWithResponse = items.filter(
          (item) => item.status === 'closed' && item.first_response_at
        );
        let avgResponseTime = null;
        if (closedWithResponse.length > 0) {
          const totalTime = closedWithResponse.reduce((sum, item) => {
            const created = new Date(item.created_at).getTime();
            const responded = new Date(item.first_response_at).getTime();
            return sum + (responded - created);
          }, 0);
          avgResponseTime = Math.round(totalTime / closedWithResponse.length / (1000 * 60 * 60)); // в часах
        }

        setStats({
          total,
          new: newCount,
          inProgress,
          waiting,
          closed,
          avgResponseTime,
        });

        setLoading(false);
      } catch (err) {
        setError('Произошла ошибка при загрузке данных');
        setLoading(false);
      }
    })();
  }, []);

  const total = useMemo(() => rows.reduce((s, r) => s + r.count, 0), [rows]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-semibold light:text-gray-900">Дашборды</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 max-w-3xl light:text-gray-600">
        Доступно руководителям направлений и руководству ОСС. Данные ограничиваются политиками доступа (RLS).
      </p>

      {error && (
        <div className="mt-6 rounded-xl sm:rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs sm:text-sm text-red-400 light:bg-red-50 light:border-red-200 light:text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Всего обращений</div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold light:text-gray-900">{loading ? '…' : stats.total}</div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Новых</div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-blue-400 light:text-blue-600">{loading ? '…' : stats.new}</div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">В работе</div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-yellow-400 light:text-yellow-600">
            {loading ? '…' : stats.inProgress}
          </div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Закрыто</div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-green-400 light:text-green-600">
            {loading ? '…' : stats.closed}
          </div>
        </div>
      </div>

      {stats.avgResponseTime !== null && (
        <div className="mt-6 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Среднее время до первого ответа</div>
          <div className="mt-2 text-xl sm:text-2xl font-semibold light:text-gray-900">
            {stats.avgResponseTime} {stats.avgResponseTime === 1 ? 'час' : 'часов'}
          </div>
        </div>
      )}

      <section className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold light:text-gray-900">Очередь по статусам</h2>
        <p className="mt-2 text-xs sm:text-sm text-white/70 light:text-gray-600">Распределение обращений по стадиям обработки.</p>
        {loading ? (
          <div className="mt-4 sm:mt-6 h-64 sm:h-72 flex items-center justify-center text-white/50 text-sm sm:text-base light:text-gray-500">
            Загрузка данных...
          </div>
        ) : (
          <>
            <div className="mt-4 sm:mt-6 h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows}>
                  <XAxis
                    dataKey="status"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: '#fff', fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: '#fff' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#D11F2A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {rows.map((row, i) => {
                const statusInfo = statusLabels[i];
                return (
                  <div key={i} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-white/5 light:bg-gray-50">
                    <span className="text-xs sm:text-sm text-white/80 light:text-gray-700">{row.status}</span>
                    <span
                      className="text-base sm:text-lg font-semibold"
                      style={{ color: statusInfo?.color || '#fff' }}
                    >
                      {row.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

