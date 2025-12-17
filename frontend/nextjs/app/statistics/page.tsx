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

        const { data: d1, error: e1 } = await supabase
          .from('appeals_public_daily')
          .select('*')
          .order('day', { ascending: true })
          .limit(90);

        const { data: d2, error: e2 } = await supabase
          .from('appeals_public_by_direction')
          .select('*')
          .order('total_count', { ascending: false });

        if (e1 || e2) {
          setError('Не удалось загрузить статистику');
          return;
        }

        setDaily((d1 as any) || []);

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
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold">Статистика обращений</h1>
      <p className="mt-3 text-white/70 max-w-3xl">
        Здесь показываются только агрегированные данные. Никаких персональных данных студентов или содержания обращений.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">Создано (последние 90 дней)</div>
          <div className="mt-2 text-3xl font-semibold">{loading ? '…' : totals.created}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">Закрыто (последние 90 дней)</div>
          <div className="mt-2 text-3xl font-semibold">{loading ? '…' : totals.closed}</div>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Динамика</h2>
        <p className="mt-2 text-white/70">Количество обращений по дням (создано/закрыто).</p>
        <div className="mt-6 h-72">
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
        <div className="mt-8 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Распределение по направлениям</h2>
        <p className="mt-2 text-white/70">Сколько обращений относится к каждому направлению (накопительно).</p>
        {loading ? (
          <div className="mt-6 h-72 flex items-center justify-center text-white/50">
            Загрузка данных...
          </div>
        ) : byDir.length === 0 ? (
          <div className="mt-6 h-72 flex items-center justify-center text-white/50">
            Нет данных для отображения
          </div>
        ) : (
          <>
            <div className="mt-6 h-72">
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
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-white/80">{item.direction_title || 'Не указано'}</span>
                  <span className="text-white/60">{item.total_count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
