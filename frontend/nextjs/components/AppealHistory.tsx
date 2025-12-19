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

