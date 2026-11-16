'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DIRECTIONS } from '../lib/directions';
import DirectionCard from '../components/DirectionCard';
import ContentCard from '../components/ContentCard';
import TelegramPosts from '../components/TelegramPosts';
import { getPublishedGuides } from '../lib/guides';
import Logo from '../components/Logo';
import StudentOrganizationsCard from '../components/StudentOrganizationsCard';
import StudentOrganizations from '../components/StudentOrganizations';

const featuredGuides = getPublishedGuides()
  .filter((guide) => guide.level === 'basic' || guide.committee === 'Правовой комитет')
  .slice(0, 3);

type HomeNewsItem = {
  id: string;
  type: 'news' | 'guide' | 'faq';
  title: string;
  slug: string;
  published_at?: string | null;
  direction_title?: string | null;
};

function isHomeNewsItem(x: unknown): x is HomeNewsItem {
  if (x === null || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  const type = o.type;
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.slug === 'string' &&
    (type === 'news' || type === 'guide' || type === 'faq')
  );
}

function parseHomeNewsList(raw: unknown): HomeNewsItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isHomeNewsItem);
}

export default function Home() {
  const [latestNews, setLatestNews] = useState<HomeNewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsUnavailable, setNewsUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLatestNews() {
      try {
        const response = await fetch('/api/data/content?type=news&limit=3', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('News request failed');
        const payload = await response.json();
        setLatestNews(parseHomeNewsList(payload?.data));
      } catch {
        if (!controller.signal.aborted) setNewsUnavailable(true);
      } finally {
        if (!controller.signal.aborted) setLoadingNews(false);
      }
    }

    void loadLatestNews();
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-transparent text-white light:text-gray-900 animate-page-enter winter-main">
      <section className="bg-gradient-to-br from-oss-red via-oss-burgundy to-oss-graphite py-12 sm:py-16 md:py-20 
        light:bg-gradient-to-b light:from-white light:via-gray-50/50 light:to-white
        light:relative light:overflow-hidden
        light:border-b light:border-gray-200/60
        winter-hero">
        {/* Декоративные элементы для светлой темы - строгие геометрические формы */}
        <div className="hidden light:block absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Тонкие линии для структуры */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200/40 to-transparent"></div>
          
          {/* Элегантные акценты */}
          <div className="absolute top-20 right-10 w-64 h-64 bg-oss-red/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-oss-red/3 rounded-full blur-3xl"></div>
          
          {/* Геометрические элементы */}
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-oss-red/20 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-oss-red/15 rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-oss-red/10 rounded-full"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="flex justify-center mb-6 sm:mb-8 animate-fade-in-down">
            <div className="sm:hidden">
              <Logo size={80} color="#FFFFFF" useImage={true} />
            </div>
            <div className="hidden sm:block">
              <Logo size={120} color="#FFFFFF" useImage={true} priority={true} />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 text-white 
            light:text-gray-900 light:font-extrabold light:tracking-tight
            animate-fade-in-down winter-hero-title">
            ОБЪЕДИНЕННЫЙ СОВЕТ СТУДЕНТОВ
          </h1>
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 animate-fade-in-up animate-delay-100">
            <div className="hidden light:block w-12 h-px bg-gradient-to-r from-transparent via-oss-red/30 to-oss-red/30"></div>
            <p className="text-base sm:text-lg md:text-xl text-white/90 
              light:text-gray-600 light:font-semibold light:uppercase light:tracking-wider light:text-sm">
              Дальневосточный федеральный университет
            </p>
            <div className="hidden light:block w-12 h-px bg-gradient-to-l from-transparent via-oss-red/30 to-oss-red/30"></div>
          </div>
          <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto text-white/80 mb-6 sm:mb-8 px-4 
            light:text-gray-700 light:font-medium light:leading-relaxed animate-fade-in-up animate-delay-200">
            Помогаем студентам ДВФУ разобраться с вопросами учёбы, общежития, стипендий и адаптации.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/contacts"
              className="professional-button professional-button-primary px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold focus-ring"
            >
              Связаться с ОСС
            </Link>
            <Link
              href="/directions"
              className="professional-button professional-button-secondary px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold focus-ring"
            >
              Найти своё направление
            </Link>
            <Link
              href="/content"
              className="professional-button professional-button-secondary px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold focus-ring"
            >
              Открыть гайды
            </Link>
          </div>
          <div className="mt-4 sm:mt-6 flex justify-center">
            <Link 
              href="/about" 
              className="text-xs sm:text-sm text-white/60 hover:text-white/90 transition-colors duration-200 
                light:text-gray-500 light:hover:text-oss-red light:font-medium
                flex items-center gap-1.5 animate-fade-in-up animate-delay-500
                px-3 py-1.5 rounded-md hover:bg-white/5 light:hover:bg-gray-100/50"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              О проекте и технологиях
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div className="animate-fade-in-up">
            <h2 className="text-xl sm:text-2xl font-semibold text-white light:text-gray-900 light:font-bold">Направления</h2>
            <p className="mt-2 text-sm sm:text-base text-white/70 light:text-gray-600 max-w-2xl light:font-medium leading-relaxed">
              Выберите тему вопроса: учёба и права, общежитие, стипендии или адаптация.
            </p>
          </div>
          <Link href="/directions" className="elegant-link text-sm sm:text-base text-white/70 hover:text-white whitespace-nowrap
            light:text-oss-red light:hover:text-oss-red/80 light:font-semibold light:flex light:items-center light:gap-1 focus-ring px-2 py-1 rounded-md animate-fade-in-up animate-delay-200">
            Все направления <span className="light:transition-transform light:group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
          {DIRECTIONS.map((d, index) => {
            const delayClass = index === 0 ? 'animate-delay-100' : index === 1 ? 'animate-delay-200' : index === 2 ? 'animate-delay-300' : index === 3 ? 'animate-delay-400' : 'animate-delay-500';
            return (
              <div key={d.slug} className={`animate-fade-in-up ${delayClass} flex`}>
                <DirectionCard d={d} />
              </div>
            );
          })}
          {/* Карточка студенческих организаций */}
          <div className="animate-fade-in-up animate-delay-500 flex">
            <StudentOrganizationsCard />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white light:text-gray-900">Новости и гайды</h2>
              <Link href="/content" className="text-sm sm:text-base text-white/80 hover:text-white transition whitespace-nowrap light:text-oss-red light:hover:text-oss-red/80">
                Все материалы →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredGuides.map((guide) => (
                <ContentCard
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  slug={guide.slug}
                  title={guide.title}
                  type="guide"
                  direction={guide.committee}
                  excerpt={guide.description}
                />
              ))}
            </div>

            <h3 className="mt-8 mb-4 text-lg font-semibold light:text-gray-900">Последние новости</h3>
            {loadingNews ? (
              <p role="status" className="text-sm text-white/70 light:text-gray-600">Загрузка новостей…</p>
            ) : latestNews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {latestNews.map((item) => (
                  <ContentCard
                    key={item.id}
                    title={item.title}
                    slug={item.slug}
                    type={item.type}
                    direction={item.direction_title ?? undefined}
                    publishedAt={item.published_at ?? undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl sm:rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-8 md:p-10 text-center text-white/70 text-sm sm:text-base light:text-gray-600">
                {newsUnavailable ? 'Новости на сайте временно недоступны. Обновления есть в Telegram.' : 'Пока нет опубликованных новостей.'}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="light:premium-card light:rounded-2xl light:p-6 light:sticky light:top-24">
              <TelegramPosts limit={3} />
            </div>
          </div>
        </div>
      </section>

      <StudentOrganizations />
    </main>
  );
}
