
'use client';

import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import AppealStatusBadge from '../../../components/AppealStatusBadge';
import { AppealStatus } from '../../../lib/appealStatus';

export default function AppealStatusPage() {
  const [token, setToken] = useState('');
  const [appeal, setAppeal] = useState<{
    status: AppealStatus;
    title: string;
    created_at: string;
    closed_at: string | null;
    first_response_at: string | null;
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
      .select('status, title, created_at, closed_at, first_response_at')
      .eq('public_token', token.trim())
      .single();

    setLoading(false);

    if (fetchError || !data) {
      setError('Обращение с таким кодом не найдено. Проверьте правильность кода.');
      return;
    }

    setAppeal(data as any);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      <h1 className="text-2xl sm:text-3xl font-semibold light:text-gray-900">Проверить статус обращения</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 light:text-gray-600">
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

        {appeal && (
          <div className="mt-6 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 space-y-4 light:bg-white light:border-gray-200 light:shadow-sm">
            <div>
              <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Тема обращения</div>
              <div className="mt-1 text-sm sm:text-base font-medium light:text-gray-900">{appeal.title}</div>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-white/60 light:text-gray-500 mb-2">Статус</div>
              <AppealStatusBadge status={appeal.status} showDescription={true} size="md" />
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between flex-wrap gap-2">
                <span className="text-white/60 light:text-gray-500">Подано:</span>
                <span className="text-white/80 light:text-gray-700">
                  {new Date(appeal.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {appeal.first_response_at && (
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="text-white/60 light:text-gray-500">Первый ответ:</span>
                  <span className="text-white/80 light:text-gray-700">
                    {new Date(appeal.first_response_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              {appeal.closed_at && (
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="text-white/60 light:text-gray-500">Закрыто:</span>
                  <span className="text-white/80 light:text-gray-700">
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
