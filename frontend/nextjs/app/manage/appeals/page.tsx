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

    // Для MVP создаем упрощенный список
    const availableUsersList = (availableUsers || []).map((ur: any) => ({
      id: ur.user_id,
      email: `user-${ur.user_id.substring(0, 8)}@example.com`,
    }));

    setUsers(availableUsersList);
    setLoading(false);
  }

  // Фильтрация по поисковому запросу
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAppeals(appeals);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = appeals.filter((appeal) => {
      return (
        appeal.title?.toLowerCase().includes(query) ||
        appeal.description?.toLowerCase().includes(query) ||
        appeal.contact_value?.toLowerCase().includes(query)
      );
    });
    setFilteredAppeals(filtered);
  }, [searchQuery, appeals]);

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const g: Record<string, any[]> = { new: [], in_progress: [], waiting: [], closed: [] };
    for (const a of filteredAppeals) g[a.status]?.push(a);
    return g;
  }, [filteredAppeals]);

  async function move(id: string, to: AppealStatus) {
    setError(null);
    const appeal = appeals.find((a) => a.id === id);
    if (!appeal) return;

    const updateData: any = { status: to };
    
    // Автоматически устанавливаем first_response_at при переходе из new в in_progress
    if (to === 'in_progress' && appeal.status === 'new') {
      updateData.first_response_at = new Date().toISOString();
    }
    
    // Автоматически устанавливаем closed_at при закрытии
    if (to === 'closed') {
      updateData.closed_at = new Date().toISOString();
    }

    const { data: updatedAppeal, error } = await supabase
      .from('appeals')
      .update(updateData)
      .eq('id', id)
      .select('public_token, contact_type, contact_value')
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setAppeals((prev) => prev.map((a) => (a.id === id ? { ...a, ...updateData } : a)));
    
    // Отправляем уведомления заинтересованным пользователям
    if (updatedAppeal) {
      notifyAppealChange(id, {
        status: to,
        assigned_to: appeal.assigned_to,
        title: appeal.title,
      }).catch((err) => {
        console.error('Notification error:', err);
      });
    }
    
    if (updatedAppeal && appeal.contact_value) {
      // Telegram уведомление
      if (appeal.contact_type === 'telegram') {
        try {
          await fetch('/api/notifications/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              appealId: id,
              status: to,
              title: appeal.title,
              contactValue: appeal.contact_value,
              contactType: appeal.contact_type,
              publicToken: updatedAppeal.public_token,
            }),
          });
        } catch (notifError) {
          console.warn('Не удалось отправить Telegram уведомление:', notifError);
        }
      }
      
      // Email уведомление
      if (appeal.contact_type === 'email') {
        try {
          await fetch('/api/notifications/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              appealId: id,
              status: to,
              title: appeal.title,
              contactValue: appeal.contact_value,
              contactType: appeal.contact_type,
              publicToken: updatedAppeal.public_token,
            }),
          });
        } catch (notifError) {
          console.warn('Не удалось отправить Email уведомление:', notifError);
        }
      }
    }
  }

  async function assign(id: string, userId: string | null) {
    setError(null);
    const appeal = appeals.find((a) => a.id === id);
    if (!appeal) return;

    const { error } = await supabase
      .from('appeals')
      .update({ assigned_to: userId })
      .eq('id', id);
    
    if (error) {
      setError(error.message);
