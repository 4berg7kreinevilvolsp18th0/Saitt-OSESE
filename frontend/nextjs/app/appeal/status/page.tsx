
'use client';

import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

type AppealStatus = 'new' | 'in_progress' | 'waiting' | 'closed';

const statusLabels: Record<AppealStatus, { label: string; description: string; color: string }> = {
  new: {
    label: 'Принято',
    description: 'Ваше обращение зарегистрировано и ожидает обработки',
    color: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  },
  in_progress: {
    label: 'В работе',
    description: 'Обращение обрабатывается ответственным сотрудником',
    color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  },
  waiting: {
    label: 'Нужна информация',
    description: 'Требуется дополнительная информация от вас для решения вопроса',
    color: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
  },
  closed: {
    label: 'Решено',
    description: 'Обращение закрыто. Если вопрос не решён, можете подать новое обращение',
    color: 'bg-green-500/20 border-green-500/40 text-green-300',
  },
};

export default function AppealStatusPage() {
  const [token, setToken] = useState('');
  const [appeal, setAppeal] = useState<{
    status: AppealStatus;
    title: string;
    created_at: string;
    closed_at: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function check() {
    if (!token.trim()) {
      setError('Введите код обращения');
      return;
    }

    setLoading(true);
    setError(null);
    setAppeal(null);

    const { data, error: fetchError } = await supabase
      .from('appeals')
      .select('status, title, created_at, closed_at')
      .eq('public_token', token.trim())
      .single();

    setLoading(false);

    if (fetchError || !data) {
      setError('Обращение с таким кодом не найдено. Проверьте правильность кода.');
      return;
    }

    setAppeal(data as any);
  }

  const statusInfo = appeal ? statusLabels[appeal.status as AppealStatus] : null;

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold">Проверить статус обращения</h1>
      <p className="mt-3 text-white/70">
        Введите код обращения, который вы получили при подаче заявки.
      </p>

      <div className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Код обращения</label>
          <input
            className="w-full rounded-xl bg-white/10 p-3 border border-white/20 font-mono"
            placeholder="Вставьте код обращения"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') check();
            }}
          />
        </div>
        <button
          onClick={check}
          disabled={loading}
          className="w-full rounded-xl bg-oss-red py-3 font-semibold hover:bg-oss-red/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Проверка...' : 'Проверить статус'}
        </button>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {appeal && statusInfo && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div>
              <div className="text-sm text-white/60">Тема обращения</div>
              <div className="mt-1 font-medium">{appeal.title}</div>
            </div>

            <div>
              <div className="text-sm text-white/60">Статус</div>
              <div className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${statusInfo.color}`}>
                <span className="font-semibold">{statusInfo.label}</span>
              </div>
              <p className="mt-2 text-sm text-white/70">{statusInfo.description}</p>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Подано:</span>
                <span className="text-white/80">
                  {new Date(appeal.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {appeal.closed_at && (
                <div className="flex justify-between">
                  <span className="text-white/60">Закрыто:</span>
                  <span className="text-white/80">
                    {new Date(appeal.closed_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
