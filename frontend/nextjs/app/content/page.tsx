'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import ContentCard from '../../components/ContentCard';
import Badge from '../../components/Badge';
import { DIRECTIONS } from '../../lib/directions';

type ContentItem = {
  id: string;
  type: 'news' | 'guide' | 'faq';
  title: string;
  slug: string;
  direction_id: string | null;
  published_at: string | null;
  direction_title?: string;
  direction_slug?: string;
};

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'news' | 'guide' | 'faq'>('all');
  const [filterDirection, setFilterDirection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('content')
        .select('id, type, title, slug, direction_id, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

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
            .select('id, title, slug')
            .in('id', directionIds);

          const directionsMap = new Map(
            (directions || []).map((d: any) => [d.id, { title: d.title, slug: d.slug }])
          );

          const enriched = data.map((item: any) => ({
            ...item,
            direction_title: item.direction_id
              ? directionsMap.get(item.direction_id)?.title
              : undefined,
            direction_slug: item.direction_id ? directionsMap.get(item.direction_id)?.slug : undefined,
          }));

          setContent(enriched as ContentItem[]);
        } else {
          setContent(data as ContentItem[]);
        }
      } else {
        setContent([]);
      }
    } catch (err) {
      setError('Произошла ошибка при загрузке');
    } finally {
      setLoading(false);
    }
  }

  const filteredContent = content.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterDirection !== 'all' && item.direction_slug !== filterDirection) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold">Новости и гайды</h1>
      <p className="mt-3 text-white/70">
        Официальные разъяснения, инструкции и новости ОСС.
      </p>

      {/* Фильтры и поиск */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Поиск по заголовку..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/50"
            />
          </div>
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
          <select
            value={filterDirection}
            onChange={(e) => setFilterDirection(e.target.value)}
            className="rounded-xl bg-white/10 p-3 border border-white/20 text-white"
          >
            <option value="all">Все направления</option>
            {DIRECTIONS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 text-center text-white/50">Загрузка...</div>
      ) : filteredContent.length === 0 ? (
        <div className="mt-8 text-center text-white/50">
          {searchQuery || filterType !== 'all' || filterDirection !== 'all'
            ? 'Ничего не найдено по заданным фильтрам'
            : 'Пока нет опубликованного контента'}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContent.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              slug={item.slug}
              type={item.type}
              direction={item.direction_title}
              publishedAt={item.published_at || undefined}
            />
          ))}
        </div>
      )}
    </main>
  );
}
