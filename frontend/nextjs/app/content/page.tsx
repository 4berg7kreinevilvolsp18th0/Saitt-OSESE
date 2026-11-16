'use client';

import { useEffect, useState } from 'react';
import ContentCard from '../../components/ContentCard';
import { DIRECTIONS } from '../../lib/directions';
import { getPublishedGuides, type GuideLevel } from '../../lib/guides';

type ContentType = 'news' | 'guide' | 'faq';

type PublishedItem = {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  direction_title?: string | null;
  direction_slug?: string | null;
  published_at?: string | null;
};

type CatalogItem = PublishedItem & {
  href?: string;
  description?: string;
  tags?: string[];
  level?: GuideLevel;
  updatedAt?: string;
};

const builtInGuides: CatalogItem[] = getPublishedGuides().map((guide) => ({
  id: guide.slug,
  type: 'guide',
  title: guide.title,
  slug: guide.slug,
  href: `/guides/${guide.slug}`,
  description: guide.description,
  tags: guide.tags,
  level: guide.level,
  updatedAt: guide.updatedAt,
  direction_title: guide.committee,
  direction_slug: DIRECTIONS.find((direction) => direction.title === guide.committee)?.slug,
}));

const builtInGuideSlugs = new Set(builtInGuides.map((guide) => guide.slug));

const fieldClass =
  'w-full rounded-xl bg-white/10 p-3 border border-white/20 text-sm text-white focus-ring ' +
  'light:bg-white light:border-gray-300 light:text-gray-900';

export default function ContentPage() {
  const [content, setContent] = useState<PublishedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [filterType, setFilterType] = useState<'all' | ContentType>('all');
  const [filterDirection, setFilterDirection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [guideLevel, setGuideLevel] = useState<'all' | GuideLevel>('all');
  const [freshness, setFreshness] = useState('all');

  useEffect(() => {
    const controller = new AbortController();

    async function loadContent() {
      try {
        const response = await fetch('/api/data/content', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Content request failed');
        const payload = await response.json();
        if (!Array.isArray(payload?.data)) throw new Error('Invalid content response');
        setContent(payload.data);
      } catch {
        if (!controller.signal.aborted) setUnavailable(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadContent();
    return () => controller.abort();
  }, []);

  const query = searchQuery.trim().toLowerCase().replaceAll('ё', 'е');
  const earliestDate = freshness === 'all' ? null : Date.now() - Number(freshness) * 86_400_000;
  const items: CatalogItem[] = [
    ...builtInGuides,
    ...content.filter((item) => item.type !== 'guide' || !builtInGuideSlugs.has(item.slug)),
  ];
  const filteredItems = items.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterDirection !== 'all' && item.direction_slug !== filterDirection) return false;
    if (filterType === 'guide' && guideLevel !== 'all' && item.level !== guideLevel) return false;

    if (earliestDate !== null) {
      const date = Date.parse(item.updatedAt ?? item.published_at ?? '');
      if (!Number.isFinite(date) || date < earliestDate) return false;
    }

    const searchableText = [item.title, item.description, ...(item.tags ?? [])].join(' ');
    return searchableText.toLowerCase().replaceAll('ё', 'е').includes(query);
  });

  function resetFilters() {
    setSearchQuery('');
    setFilterType('all');
    setFilterDirection('all');
    setGuideLevel('all');
    setFreshness('all');
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-semibold light:text-gray-900">Новости и гайды</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 light:text-gray-600">
        Инструкции, ответы на частые вопросы и новости ОСС.
      </p>

      <section aria-label="Поиск и фильтры" className="mt-6 sm:mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200">
        <label htmlFor="catalog-search" className="block text-sm font-medium mb-2">Поиск по материалам</label>
        <input
          id="catalog-search"
          type="search"
          placeholder="Например, общежитие"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className={`${fieldClass} placeholder-white/50 light:placeholder-gray-500`}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select aria-label="Тип материала" value={filterType} className={fieldClass}
            onChange={(event) => {
              setFilterType(event.target.value as 'all' | ContentType);
              setGuideLevel('all');
            }}>
            <option value="all">Все типы</option>
            <option value="guide">Гайды</option>
            <option value="news">Новости</option>
            <option value="faq">FAQ</option>
          </select>
          <select aria-label="Направление" value={filterDirection} className={fieldClass}
            onChange={(event) => setFilterDirection(event.target.value)}>
            <option value="all">Все направления</option>
            {DIRECTIONS.map((direction) => (
              <option key={direction.slug} value={direction.slug}>{direction.title}</option>
            ))}
          </select>
          <select aria-label="Дата обновления или публикации" value={freshness} className={fieldClass}
            onChange={(event) => setFreshness(event.target.value)}>
            <option value="all">За всё время</option>
            <option value="30">За последние 30 дней</option>
            <option value="90">За последние 90 дней</option>
          </select>
          {filterType === 'guide' && (
            <select aria-label="Уровень гайда" value={guideLevel} className={fieldClass}
              onChange={(event) => setGuideLevel(event.target.value as 'all' | GuideLevel)}>
              <option value="all">Все уровни</option>
              <option value="basic">Базовый</option>
              <option value="deepdive">Расширенный</option>
            </select>
          )}
        </div>
      </section>

      <div className="my-5 flex flex-wrap items-center justify-between gap-3 text-sm text-white/70 light:text-gray-600">
        <p role="status">
          {loading
            ? 'Загружаем публикации…'
            : unavailable
              ? 'Другие публикации временно недоступны.'
              : `Найдено материалов: ${filteredItems.length}`}
        </p>
        {(searchQuery || filterType !== 'all' || filterDirection !== 'all' || freshness !== 'all' || guideLevel !== 'all') && (
          <button type="button" onClick={resetFilters} className="rounded-lg px-3 py-2 underline focus-ring">
            Сбросить фильтры
          </button>
        )}
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <ContentCard
              key={item.href ?? item.id}
              href={item.href}
              slug={item.slug}
              title={item.title}
              type={item.type}
              direction={item.direction_title ?? undefined}
              excerpt={item.description}
              publishedAt={item.published_at ?? undefined}
            />
          ))}
        </div>
      ) : !loading && (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 light:bg-white light:border-gray-200 light:text-gray-600">
          Среди доступных материалов ничего не найдено. Попробуйте изменить запрос или фильтры.
        </p>
      )}
    </main>
  );
}
