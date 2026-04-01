'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ContentCard from '../../components/ContentCard';
import { DIRECTIONS } from '../../lib/directions';
import { getPublishedGuides } from '../../lib/guides';
import { committeeBadgeClasses } from '../../lib/theme';

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
  const publishedGuides = getPublishedGuides();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'news' | 'guide' | 'faq'>('all');
  const [filterDirection, setFilterDirection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [guideOnly, setGuideOnly] = useState(false);
  const [guideCommittee, setGuideCommittee] = useState('all');
  const [guideLevel, setGuideLevel] = useState<'all' | 'basic' | 'deepdive'>('all');
  const [guideFreshness, setGuideFreshness] = useState<'all' | '30' | '90'>('all');

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/data/content', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error || 'Не удалось загрузить контент');
        return;
      }
      const data = payload?.data || [];

      // Получаем названия направлений для контента
      if (data && data.length > 0) {
        setContent(data as ContentItem[]);
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
    if (guideOnly && item.type !== 'guide') return false;
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterDirection !== 'all' && item.direction_slug !== filterDirection) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const guideCommittees = Array.from(new Set(publishedGuides.map((guide) => guide.committee)));
  const now = new Date();

  const filteredGuides = publishedGuides.filter((guide) => {
    if (searchQuery && !guide.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (guideCommittee !== 'all' && guide.committee !== guideCommittee) return false;
    if (guideLevel !== 'all' && guide.level !== guideLevel) return false;
    if (guideFreshness !== 'all') {
      const days = Number(guideFreshness);
      const updated = new Date(guide.updatedAt);
      const diff = (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24);
      if (diff > days) return false;
    }
    return true;
  });

  const recommendedGuides = publishedGuides.slice(0, 3);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-semibold light:text-gray-900">Новости и гайды</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 light:text-gray-600">
        Официальные разъяснения, инструкции и новости ОСС.
      </p>

      <section className="mt-6 sm:mt-8 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold light:text-gray-900">Гайды ОСС</h2>
        <p className="mt-2 text-sm sm:text-base text-white/70 light:text-gray-600">
          Подборка материалов: опубликованный гайд правового комитета и демонстрационные шаблоны.
        </p>
        {/* GUIDE_PUBLISH_CHECKLIST.md: перед публикацией нового гайда сверяйтесь с чеклистом качества */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {publishedGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition light:bg-gray-50 light:border-gray-200 light:hover:bg-gray-100"
            >
              <p className="text-sm font-semibold light:text-gray-900">{guide.title}</p>
              <p className="mt-1 text-xs sm:text-sm text-white/70 light:text-gray-600">{guide.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${committeeBadgeClasses(guide.colorKey)}`}>
                  {guide.committee}
                </span>
                <p className="text-[11px] text-white/50 light:text-gray-500">
                  {guide.level === 'deepdive' ? 'Расширенный' : 'Базовый'} · {guide.updatedAt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 sm:mt-8 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold light:text-gray-900">Фильтры по гайдам</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="flex items-center gap-2 text-sm text-white/80 light:text-gray-700">
            <input type="checkbox" checked={guideOnly} onChange={(e) => setGuideOnly(e.target.checked)} />
            Только гайды в общей выдаче
          </label>
          <select
            value={guideCommittee}
            onChange={(e) => setGuideCommittee(e.target.value)}
            className="rounded-xl bg-white/10 p-3 border border-white/20 text-sm text-white light:bg-white light:border-gray-300 light:text-gray-900"
          >
            <option value="all">Комитет: все</option>
            {guideCommittees.map((committee) => (
              <option key={committee} value={committee}>
                {committee}
              </option>
            ))}
          </select>
          <select
            value={guideLevel}
            onChange={(e) => setGuideLevel(e.target.value as 'all' | 'basic' | 'deepdive')}
            className="rounded-xl bg-white/10 p-3 border border-white/20 text-sm text-white light:bg-white light:border-gray-300 light:text-gray-900"
          >
            <option value="all">Уровень: все</option>
            <option value="basic">Базовый</option>
            <option value="deepdive">Расширенный</option>
          </select>
          <select
            value={guideFreshness}
            onChange={(e) => setGuideFreshness(e.target.value as 'all' | '30' | '90')}
            className="rounded-xl bg-white/10 p-3 border border-white/20 text-sm text-white light:bg-white light:border-gray-300 light:text-gray-900"
          >
            <option value="all">Актуальность: все</option>
            <option value="30">Обновлены за 30 дней</option>
            <option value="90">Обновлены за 90 дней</option>
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition light:bg-gray-50 light:border-gray-200 light:hover:bg-gray-100"
            >
              <p className="text-sm font-semibold light:text-gray-900">{guide.title}</p>
              <p className="mt-1 text-xs text-white/70 light:text-gray-600">{guide.description}</p>
              <span className={`mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${committeeBadgeClasses(guide.colorKey)}`}>
                {guide.committee}
              </span>
            </Link>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-500/10 p-4 light:bg-amber-50 light:border-amber-200">
            <p className="text-sm text-white/80 light:text-gray-700">
              Ничего не найдено по фильтрам. Попробуйте расширить критерии.
            </p>
            <p className="mt-3 text-xs uppercase tracking-wider text-white/60 light:text-gray-500">
              Рекомендуемые гайды
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {recommendedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 light:text-gray-700 light:border-gray-300 light:hover:bg-gray-100"
                >
                  {guide.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Фильтры и поиск */}
      <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Поиск по заголовку..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-sm sm:text-base text-white placeholder-white/50 light:bg-white light:border-gray-300 light:text-gray-900 light:placeholder-gray-400"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="rounded-xl bg-white/10 p-3 border border-white/20 text-sm sm:text-base text-white light:bg-white light:border-gray-300 light:text-gray-900"
          >
            <option value="all">Все типы</option>
            <option value="news">Новости</option>
            <option value="guide">Гайды</option>
            <option value="faq">FAQ</option>
          </select>
          <select
            value={filterDirection}
            onChange={(e) => setFilterDirection(e.target.value)}
            className="rounded-xl bg-white/10 p-3 border border-white/20 text-sm sm:text-base text-white light:bg-white light:border-gray-300 light:text-gray-900"
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
        <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs sm:text-sm text-red-400 light:bg-red-50 light:border-red-200 light:text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 text-center text-white/50 text-sm sm:text-base light:text-gray-500">Загрузка...</div>
      ) : filteredContent.length === 0 ? (
        <div className="mt-8 text-center text-white/50 text-sm sm:text-base light:text-gray-500">
          {searchQuery || filterType !== 'all' || filterDirection !== 'all'
            ? 'Ничего не найдено по заданным фильтрам'
            : 'Пока нет опубликованного контента'}
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
