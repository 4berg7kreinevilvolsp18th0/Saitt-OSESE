'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLocale } from './LocaleProvider';

interface AppealHistoryItem {
  id: string;
  action: string;
  description: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  changed_by: string | null;
  changed_by_name?: string;
}

interface AppealHistoryProps {
  appealId: string;
}

const actionLabels: Record<string, string> = {
  status_changed: 'Статус изменён',
  assigned: 'Назначен ответственный',
  priority_changed: 'Приоритет изменён',
  deadline_set: 'Дедлайн установлен',
  comment_added: 'Добавлен комментарий',
};

const actionIcons: Record<string, string> = {
  status_changed: '🔄',
  assigned: '👤',
  priority_changed: '⚡',
  deadline_set: '📅',
  comment_added: '💬',
};

export default function AppealHistory({ appealId }: AppealHistoryProps) {
  const [history, setHistory] = useState<AppealHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    if (expanded && appealId) {
      loadHistory();
    }
  }, [expanded, appealId]);

  async function loadHistory() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appeal_history')
        .select('*')
        .eq('appeal_id', appealId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Ошибка загрузки истории:', error);
        return;
      }

      setHistory((data as any) || []);
    } catch (err) {
      console.error('Ошибка:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="text-xs px-2 py-1 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition light:border-gray-300 light:text-gray-700 light:hover:bg-gray-50"
      >
        📋 История
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 light:bg-white light:border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold light:text-gray-900">История изменений</h3>
        <button
          onClick={() => setExpanded(false)}
          className="text-xs text-white/60 hover:text-white/80 light:text-gray-500 light:hover:text-gray-700"
        >
          Свернуть
        </button>
      </div>

      {loading ? (
        <div className="text-xs text-white/50 light:text-gray-500">Загрузка...</div>
      ) : history.length === 0 ? (
        <div className="text-xs text-white/50 light:text-gray-500">История изменений пуста</div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="text-xs p-2 rounded-lg bg-white/5 light:bg-gray-50 border border-white/10 light:border-gray-200"
            >
              <div className="flex items-start gap-2">
                <span className="text-base">{actionIcons[item.action] || '📝'}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium light:text-gray-900">
                    {actionLabels[item.action] || item.action}
                  </div>
                  {item.description && (
                    <div className="mt-1 text-white/70 light:text-gray-600">{item.description}</div>
                  )}
                  {(item.old_value || item.new_value) && (
                    <div className="mt-1 flex items-center gap-2 text-white/50 light:text-gray-400">
                      {item.old_value && (
                        <span className="line-through">{item.old_value}</span>
                      )}
                      {item.old_value && item.new_value && <span>→</span>}
                      {item.new_value && <span>{item.new_value}</span>}
                    </div>
                  )}
                  <div className="mt-1 text-white/40 light:text-gray-400">
                    {new Date(item.created_at).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

