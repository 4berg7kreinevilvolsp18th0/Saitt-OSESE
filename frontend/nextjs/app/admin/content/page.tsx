'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import Badge from '../../../components/Badge';
import { DIRECTIONS } from '../../../lib/directions';
import SearchBar from '../../../components/SearchBar';
import { useToast } from '../../../components/ToastProvider';

type ContentItem = {
  id: string;
  type: 'news' | 'guide' | 'faq';
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  direction_id: string | null;
  direction_title?: string;
};

export default function AdminContentPage() {
  const toast = useToast();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [filterType, setFilterType] = useState<'all' | 'news' | 'guide' | 'faq'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('content')
        .select('id, type, title, slug, status, published_at, direction_id')
        .order('updated_at', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError('Не удалось загрузить контент');
        return;
      }

      // Получаем названия направлений
      if (data && data.length > 0) {
        const directionIds = data
          .map((item) => item.direction_id)
          .filter(Boolean) as string[];

        if (directionIds.length > 0) {
          const { data: directions } = await supabase
            .from('directions')
            .select('id, title')
            .in('id', directionIds);

          const directionsMap = new Map((directions || []).map((d: any) => [d.id, d.title]));

          const enriched = data.map((item: any) => ({
            ...item,
            direction_title: item.direction_id ? directionsMap.get(item.direction_id) : undefined,
          }));

          setAllContent(enriched as ContentItem[]);
        } else {
          setAllContent(data as ContentItem[]);
        }
      } else {
        setAllContent([]);
      }
    } catch (err) {
      setError('Произошла ошибка при загрузке');
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('content')
      .update({
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (!error) {
      loadContent();
      setSelectedItems(new Set());
      toast.success(`Статус изменён на "${newStatus === 'published' ? 'Опубликовано' : 'Черновик'}"`);
    } else {
      setError('Не удалось изменить статус');
      toast.error('Не удалось изменить статус');
    }
  }

  async function bulkUpdateStatus(newStatus: 'draft' | 'published' | 'archived') {
    if (selectedItems.size === 0) return;

    const selectedIds = Array.from(selectedItems);
    const updates = selectedIds.map((id) => ({
      id,
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('content')
        .update({
          status: update.status,
          published_at: update.published_at,
        })
        .eq('id', update.id);

      if (error) {
        setError(`Ошибка при обновлении ${update.id}`);
        return;
      }
    }

    loadContent();
    setSelectedItems(new Set());
    toast.success(`Обновлено ${updates.length} материалов`);
  }

  async function bulkDelete() {
    if (selectedItems.size === 0) return;
    if (!confirm(`Удалить ${selectedItems.size} материалов? Это действие нельзя отменить.`)) return;

    const selectedIds = Array.from(selectedItems);
    for (const id of selectedIds) {
      const { error } = await supabase.from('content').delete().eq('id', id);
      if (error) {
        setError(`Ошибка при удалении ${id}`);
        return;
      }
    }

    loadContent();
    setSelectedItems(new Set());
    toast.success(`Удалено ${selectedIds.length} материалов`);
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredContent = allContent.filter((item) => {
    // Поиск
    if (searchQuery) {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery) ||
        item.slug.toLowerCase().includes(searchQuery) ||
        (item.direction_title && item.direction_title.toLowerCase().includes(searchQuery));
      if (!matchesSearch) return false;
    }

    // Фильтры
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterType !== 'all' && item.type !== filterType) return false;
    return true;
  });

  const statusLabels = {
    draft: 'Черновик',
    published: 'Опубликовано',
    archived: 'Архив',
  };

  const typeLabels = {
    news: 'Новость',
    guide: 'Гайд',
    faq: 'FAQ',
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Управление контентом</h1>
          <p className="mt-2 text-white/70">
            Создание и редактирование новостей, гайдов и FAQ. Простой интерфейс для редактирования материалов.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/content/edit/new"
            className="px-5 py-3 rounded-xl bg-oss-red font-semibold hover:bg-oss-red/90 transition"
          >
            + Создать материал
          </Link>
          <button
            onClick={loadContent}
            className="px-5 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition"
          >
            Обновить
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="rounded-xl bg-white/10 p-3 border border-white/20 text-white"
        >
          <option value="all">Все статусы</option>
          <option value="draft">Черновики</option>
          <option value="published">Опубликовано</option>
          <option value="archived">Архив</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="rounded-xl bg-white/10 p-3 border border-white/20 text-white"
        >
          <option value="all">Все типы</option>
          <option value="news">Новости</option>
          <option value="guide">Гайды</option>
          <option value="faq">FAQ</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-white/50 py-8">Загрузка...</div>
      ) : filteredContent.length === 0 ? (
        <div className="text-center text-white/50 py-8">
          {filterStatus !== 'all' || filterType !== 'all'
            ? 'Нет материалов по заданным фильтрам'
            : 'Пока нет материалов'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        item.type === 'news'
                          ? 'info'
                          : item.type === 'guide'
                            ? 'success'
                            : 'warning'
                      }
                    >
                      {typeLabels[item.type]}
                    </Badge>
                    <Badge
                      variant={
                        item.status === 'published'
                          ? 'success'
                          : item.status === 'archived'
                            ? 'default'
                            : 'warning'
                      }
                    >
                      {statusLabels[item.status]}
                    </Badge>
                    {item.direction_title && (
                      <Badge variant="default" className="text-xs">
                        {item.direction_title}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-white/60">
                    Slug: {item.slug}
                    {item.published_at &&
                      ` • Опубликовано: ${new Date(item.published_at).toLocaleDateString('ru-RU')}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/content/edit/${item.id}`}
                    className="px-3 py-2 rounded-lg border border-white/20 text-sm text-white/80 hover:text-white hover:border-white/40 transition"
                  >
                    Редактировать
                  </Link>
                  <Link
                    href={`/content/${item.slug}`}
                    target="_blank"
                    className="px-3 py-2 rounded-lg border border-white/20 text-sm text-white/80 hover:text-white hover:border-white/40 transition"
                  >
                    Просмотр
                  </Link>
                  <button
                    onClick={() => toggleStatus(item.id, item.status)}
                    className={`px-3 py-2 rounded-lg border text-sm transition ${
                      item.status === 'published'
                        ? 'border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10'
                        : 'border-green-500/40 text-green-400 hover:bg-green-500/10'
                    }`}
                  >
                    {item.status === 'published' ? 'Снять с публикации' : 'Опубликовать'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

