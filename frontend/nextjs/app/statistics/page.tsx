'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

type DailyRow = { day: string; created_count: number; closed_count: number };
type DirRow = { direction_id: string; total_count: number; direction_title?: string; direction_slug?: string };

export default function StatisticsPage() {
  const [daily, setDaily] = useState<DailyRow[]>([]);
  const [byDir, setByDir] = useState<DirRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Вычисляем статистику напрямую из таблицы appeals
        // За последние 90 дней
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        // Получаем все обращения за последние 90 дней
        const { data: appeals, error: appealsError } = await supabase
          .from('appeals')
          .select('id, created_at, closed_at, direction_id, status')
          .gte('created_at', ninetyDaysAgo.toISOString())
          .order('created_at', { ascending: true });

        if (appealsError) {
          console.error('Ошибка загрузки обращений:', appealsError);
          setError('Не удалось загрузить статистику');
          return;
        }

        // Группируем по дням
        const dailyMap = new Map<string, { created_count: number; closed_count: number }>();
        
        (appeals || []).forEach((appeal: any) => {
          const createdDate = new Date(appeal.created_at).toISOString().split('T')[0];
          if (!dailyMap.has(createdDate)) {
            dailyMap.set(createdDate, { created_count: 0, closed_count: 0 });
          }
          const dayData = dailyMap.get(createdDate)!;
          dayData.created_count += 1;

          if (appeal.status === 'closed' && appeal.closed_at) {
            const closedDate = new Date(appeal.closed_at).toISOString().split('T')[0];
            if (!dailyMap.has(closedDate)) {
              dailyMap.set(closedDate, { created_count: 0, closed_count: 0 });
            }
            dailyMap.get(closedDate)!.closed_count += 1;
          }
        });

        // Преобразуем в массив и сортируем
        const dailyArray = Array.from(dailyMap.entries())
          .map(([day, counts]) => ({

        // Получаем названия направлений
        if (d2 && d2.length > 0) {
          const directionIds = d2.map((d: any) => d.direction_id).filter(Boolean);
          if (directionIds.length > 0) {
            const { data: directions } = await supabase
              .from('directions')
              .select('id, title, slug')
              .in('id', directionIds);

            const directionsMap = new Map(
              (directions || []).map((d: any) => [d.id, { title: d.title, slug: d.slug }])
            );

            const enriched = (d2 as any[]).map((item: any) => ({
              ...item,
              direction_title: item.direction_id
                ? directionsMap.get(item.direction_id)?.title || 'Не указано'
                : 'Не указано',
              direction_slug: item.direction_id ? directionsMap.get(item.direction_id)?.slug : null,
            }));

            setByDir(enriched);
          } else {
            setByDir((d2 as any) || []);
          }
        } else {
          setByDir([]);
        }
      } catch (err) {
        setError('Произошла ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totals = useMemo(() => {
    const created = daily.reduce((s, r) => s + (r.created_count || 0), 0);
    const closed = daily.reduce((s, r) => s + (r.closed_count || 0), 0);
    return { created, closed };
  }, [daily]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-semibold light:text-gray-900">Статистика обращений</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 max-w-3xl light:text-gray-600">
        Здесь показываются только агрегированные данные. Никаких персональных данных студентов или содержания обращений.
      </p>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Создано (последние 90 дней)</div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold light:text-gray-900">{loading ? '…' : totals.created}</div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Закрыто (последние 90 дней)</div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold light:text-gray-900">{loading ? '…' : totals.closed}</div>
        </div>
      </div>

      <section className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold light:text-gray-900">Динамика</h2>
        <p className="mt-2 text-xs sm:text-sm text-white/70 light:text-gray-600">Количество обращений по дням (создано/закрыто).</p>
        <div className="mt-4 sm:mt-6 h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily}>
              <XAxis dataKey="day" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="created_count" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="closed_count" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {error && (
        <div className="mt-6 sm:mt-8 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs sm:text-sm text-red-400 light:bg-red-50 light:border-red-200 light:text-red-700">
          {error}
        </div>
      )}

      <section className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold light:text-gray-900">Распределение по направлениям</h2>
        <p className="mt-2 text-xs sm:text-sm text-white/70 light:text-gray-600">Сколько обращений относится к каждому направлению (накопительно).</p>
        {loading ? (
          <div className="mt-4 sm:mt-6 h-64 sm:h-72 flex items-center justify-center text-white/50 text-sm sm:text-base light:text-gray-500">
            Загрузка данных...
          </div>
        ) : byDir.length === 0 ? (
          <div className="mt-4 sm:mt-6 h-64 sm:h-72 flex items-center justify-center text-white/50 text-sm sm:text-base light:text-gray-500">
            Нет данных для отображения
          </div>
        ) : (
          <>
            <div className="mt-4 sm:mt-6 h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDir}>
                  <XAxis
                    dataKey="direction_title"
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
                  <Bar dataKey="total_count" fill="#D11F2A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {byDir.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs sm:text-sm p-2 rounded-lg bg-white/5 light:bg-gray-50">
                  <span className="text-white/80 light:text-gray-700">{item.direction_title || 'Не указано'}</span>
                  <span className="text-white/60 font-semibold light:text-gray-900">{item.total_count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
