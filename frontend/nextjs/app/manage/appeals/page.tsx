'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import AppealCard from '../../../components/AppealCard';
import SearchBar from '../../../components/SearchBar';
import { AppealStatus } from '../../../lib/appealStatus';
import { useLocale } from '../../../components/LocaleProvider';
import { notifyAppealChange } from '../../../lib/notifications';

type Column = { key: AppealStatus; title: string };

const columns: Column[] = [
  { key: 'new', title: 'Новое' },
  { key: 'in_progress', title: 'В работе' },
  { key: 'waiting', title: 'Ждём инфо' },
  { key: 'closed', title: 'Закрыто' },
];

export default function AdminAppealsKanban() {
  const [appeals, setAppeals] = useState<any[]>([]);
  const [filteredAppeals, setFilteredAppeals] = useState<any[]>([]);
  const [users, setUsers] = useState<Array<{ id: string; email: string; name?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLocale();

  async function load() {
    setLoading(true);
    setError(null);
    
    // Загружаем обращения с информацией о назначенных пользователях
    const { data: appealsData, error: appealsError } = await supabase
      .from('appeals')
      .select(`
        id,
        title,
        description,
        created_at,
        status,
        contact_value,
        direction_id,
        priority,
        deadline,
        assigned_to
      `)
      .order('created_at', { ascending: false })
      .limit(200);

    if (appealsError) {
      setError(appealsError.message);
      setLoading(false);
      return;
    }

    // Загружаем информацию о пользователях для назначения
    const assignedUserIds = (appealsData || [])
      .map((a: any) => a.assigned_to)
      .filter(Boolean) as string[];

    let usersMap = new Map<string, { id: string; email: string; name?: string }>();
    if (assignedUserIds.length > 0) {
      // Получаем информацию о пользователях из auth.users (через функцию или напрямую)
      // Для упрощения используем email из user_roles или создаем заглушку
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('user_id', assignedUserIds);

      // В реальности нужно получать email из auth.users, но для MVP используем заглушку
      assignedUserIds.forEach((userId) => {
        usersMap.set(userId, { id: userId, email: `user-${userId.substring(0, 8)}@example.com` });
      });
    }

    // Обогащаем обращения информацией о назначенных пользователях
    const enrichedAppeals = (appealsData || []).map((appeal: any) => ({
      ...appeal,
      assigned_user_name: appeal.assigned_to ? usersMap.get(appeal.assigned_to)?.email : undefined,
    }));

    setAppeals(enrichedAppeals);
    setFilteredAppeals(enrichedAppeals);
    
    // Загружаем список доступных пользователей для назначения
    // В реальности это должны быть пользователи с ролями member/lead/board
    const { data: availableUsers } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .limit(50);
  useEffect(() => {
    // Временно редиректим на старую страницу
    // Позже можно скопировать код из /admin/appeals
    router.replace('/admin/appeals');
  }, [router]);

  return <div>Перенаправление...</div>;
}

