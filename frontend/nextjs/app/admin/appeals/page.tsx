'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import AppealCard from '../../../components/AppealCard';
import { AppealStatus } from '../../../lib/appealStatus';

type Column = { key: AppealStatus; title: string };

const columns: Column[] = [
  { key: 'new', title: 'Новое' },
  { key: 'in_progress', title: 'В работе' },
  { key: 'waiting', title: 'Ждём инфо' },
  { key: 'closed', title: 'Закрыто' },
];

function AppealCard({
  appeal,
  onMove,
  columns,
}: {
  appeal: Appeal;
  onMove: (id: string, status: Appeal['status']) => void;
  columns: Column[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-oss-dark/40 p-3">
      <div className="text-sm font-medium">{appeal.title}</div>
      <div className="mt-1 text-xs text-white/60">
        {new Date(appeal.created_at).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
      {expanded && (
        <div className="mt-2 text-xs text-white/70 line-clamp-3">{appeal.description}</div>
      )}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-white/60 hover:text-white/80"
        >
          {expanded ? 'Свернуть' : 'Подробнее'}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {columns
          .filter((x) => x.key !== appeal.status)
          .map((x) => (
            <button
              key={x.key}
              onClick={() => onMove(appeal.id, x.key)}
              className="text-xs px-2 py-1 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition"
            >
              → {x.title}
            </button>
          ))}
      </div>
    </div>
  );
}

export default function AdminAppealsKanban() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('appeals')
      .select('id,title,description,created_at,status,contact_value,direction_id')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setAppeals((data as any) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const g: Record<string, Appeal[]> = { new: [], in_progress: [], waiting: [], closed: [] };
    for (const a of appeals) g[a.status]?.push(a);
    return g;
  }, [appeals]);

  async function move(id: string, to: Appeal['status']) {
    setError(null);
    const { error } = await supabase.from('appeals').update({ status: to }).eq('id', id);
    if (error) {
      setError(error.message);
      return;
    }
    setAppeals((prev) => prev.map((a) => (a.id === id ? { ...a, status: to } : a)));
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Обращения</h1>
          <p className="mt-2 text-white/70">
            Канбан для обработки обращений. Доступ и действия зависят от роли (member/lead/board).
          </p>
        </div>
        <button
          onClick={load}
          className="px-5 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition"
        >
          Обновить
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm">
          {error}
          <div className="mt-1 text-white/60">
            Если вы видите ошибку доступа — значит, политики RLS корректно ограничивают роль.
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((c) => (
          <section key={c.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">{c.title}</div>
            <div className="mt-3 space-y-3">
              {loading ? (
                <div className="text-sm text-white/50">Загрузка…</div>
              ) : grouped[c.key].length === 0 ? (
                <div className="text-sm text-white/50">Пусто</div>
              ) : (
                grouped[c.key].map((a) => (
                  <AppealCard key={a.id} appeal={a} onMove={move} columns={columns} />
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
