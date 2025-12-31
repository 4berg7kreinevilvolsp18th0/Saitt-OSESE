'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DIRECTIONS } from '../lib/directions';
import DirectionCard from '../components/DirectionCard';
import ContentCard from '../components/ContentCard';
import Logo from '../components/Logo';
import TelegramPosts from '../components/TelegramPosts';
import StudentOrganizations from '../components/StudentOrganizations';
import StudentOrganizationsCard from '../components/StudentOrganizationsCard';
import { supabase, isSupabaseConfigured, safeSupabaseQuery } from '../lib/supabaseClient';

export default function Home() {
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLatestNews() {
      // Проверяем подключение Supabase
      if (!isSupabaseConfigured()) {
        setSupabaseError('Supabase не настроен. Пожалуйста, настройте переменные окружения.');
        setLoadingNews(false);
        return;
      }

      try {
        // Безопасный запрос с обработкой ошибок
        const { data, error: contentError } = await safeSupabaseQuery(
          async () => {
            const result = await supabase
              .from('content')
              .select('id, type, title, slug, published_at, direction_id')
              .eq('status', 'published')
              .eq('type', 'news')
              .order('published_at', { ascending: false })
              .limit(3);
            return result;
          },
          'Ошибка загрузки новостей'
        );

        if (contentError) {
          setSupabaseError(contentError);
          setLoadingNews(false);
          return;
        }

        if (data && data.length > 0) {
          // Получаем названия направлений
          const directionIds = data.map((item) => item.direction_id).filter(Boolean);
          if (directionIds.length > 0) {
            const { data: directions, error: dirError } = await safeSupabaseQuery(
              async () => {
                const result = await supabase
                  .from('directions')
                  .select('id, title')
                  .in('id', directionIds);
                return result;
              },
              'Ошибка загрузки направлений'
            );

            if (dirError) {
              console.warn('Не удалось загрузить направления:', dirError);
              // Продолжаем без направлений
              setLatestNews(data);
            } else if (directions) {
              const directionsMap = new Map((directions || []).map((d: any) => [d.id, d.title]));

              const enriched = data.map((item: any) => ({
                ...item,
                direction_title: item.direction_id ? directionsMap.get(item.direction_id) : undefined,
              }));

              setLatestNews(enriched);
            } else {
              setLatestNews(data);
            }
          } else {
            setLatestNews(data);
          }
        } else {
          // Нет новостей - это нормально, не ошибка
          setLatestNews([]);
        }
      } catch (err: any) {
        console.error('Неожиданная ошибка:', err);
        setSupabaseError(`Неожиданная ошибка: ${err.message || 'Неизвестная ошибка'}`);
      } finally {
        setLoadingNews(false);
      }
    }

    loadLatestNews();
  }, []);

  return (
    <main className="min-h-screen bg-oss-dark light:bg-gray-50 text-white light:text-gray-900 animate-page-enter winter-main">
      <section className="bg-oss-red py-12 sm:py-16 md:py-20 
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
              <Logo size={120} color="#FFFFFF" useImage={true} />
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
            Высший орган студенческого самоуправления ДВФУ. Решаем правовые,
            инфраструктурные, стипендиальные, адаптационные и консультационные вопросы.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
            <Link 
              href="/appeal" 
              className="professional-button professional-button-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold focus-ring animate-fade-in-up animate-delay-200
                light:shadow-[0_4px_12px_rgba(209,31,42,0.25)] light:hover:shadow-[0_8px_24px_rgba(209,31,42,0.35)]"
            >
              Подать обращение
            </Link>
            <Link 
              href="/appeal/status" 
              className="professional-button professional-button-secondary px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold focus-ring animate-fade-in-up animate-delay-300
                light:bg-white light:border-2 light:border-gray-300 light:text-gray-900 
                light:hover:bg-gray-50 light:hover:border-oss-red/40 light:hover:text-oss-red
                light:shadow-[0_2px_8px_rgba(0,0,0,0.08)] light:hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            >
              Проверить статус
            </Link>
            <Link 
              href="/statistics" 
              className="professional-button professional-button-secondary px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold focus-ring animate-fade-in-up animate-delay-400
                light:bg-white light:border-2 light:border-gray-300 light:text-gray-900 
                light:hover:bg-gray-50 light:hover:border-oss-red/40 light:hover:text-oss-red
                light:shadow-[0_2px_8px_rgba(0,0,0,0.08)] light:hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            >
              Статистика
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div className="animate-fade-in-up">
            <h2 className="text-xl sm:text-2xl font-semibold text-white light:text-gray-900 light:font-bold">Направления</h2>
            <p className="mt-2 text-sm sm:text-base text-white/70 light:text-gray-600 max-w-2xl light:font-medium leading-relaxed">
              Цвет каждого раздела — часть навигации: он помогает быстро понять, в каком блоке вы находитесь.
            </p>
          </div>
          <Link href="/directions" className="elegant-link text-sm sm:text-base text-white/70 hover:text-white whitespace-nowrap
            light:text-oss-red light:hover:text-oss-red/80 light:font-semibold light:flex light:items-center light:gap-1 focus-ring px-2 py-1 rounded-md animate-fade-in-up animate-delay-200">
            Все направления <span className="light:transition-transform light:group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {DIRECTIONS.map((d, index) => {
            const delayClass = index === 0 ? 'animate-delay-100' : index === 1 ? 'animate-delay-200' : index === 2 ? 'animate-delay-300' : index === 3 ? 'animate-delay-400' : 'animate-delay-500';
            return (
              <div key={d.slug} className={`animate-fade-in-up ${delayClass}`}>
                <DirectionCard d={d} />
              </div>
            );
          })}
          {/* Карточка студенческих организаций */}
          <div className="animate-fade-in-up animate-delay-500">
            <StudentOrganizationsCard />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white light:text-gray-900">Новости и гайды</h2>
                <p className="mt-2 text-sm sm:text-base text-white/70 light:text-gray-600 max-w-2xl">
                  Публикуем актуальную информацию и инструкции по направлениям. Цель — чтобы часть вопросов решалась без обращения.
                </p>
              </div>
              <Link href="/content" className="text-sm sm:text-base text-white/70 hover:text-white transition whitespace-nowrap">
                Все материалы →
              </Link>
            </div>

            {supabaseError ? (
              <div className="rounded-2xl sm:rounded-3xl border border-yellow-500/50 bg-yellow-500/10 p-6 sm:p-8 md:p-10 text-center">
                <div className="text-yellow-400 font-semibold mb-2 text-sm sm:text-base">⚠️ Предупреждение</div>
                <div className="text-white/80 mb-4 text-sm sm:text-base">{supabaseError}</div>
                <div className="text-xs sm:text-sm text-white/60">
                  Пожалуйста, настройте Supabase согласно инструкции в{' '}
                  <a href="/docs/SUPABASE_SETUP.md" className="text-yellow-400 hover:underline">
                    docs/SUPABASE_SETUP.md
                  </a>
                </div>
              </div>
            ) : loadingNews ? (
              <div className="text-center text-white/50 py-8 text-sm sm:text-base">Загрузка новостей...</div>
            ) : latestNews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {latestNews.map((item) => (
                  <ContentCard
                    key={item.id}
                    title={item.title}
                    slug={item.slug}
                    type={item.type}
                    direction={item.direction_title}
                    publishedAt={item.published_at}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10 text-center text-white/50 text-sm sm:text-base">
                Пока нет опубликованных новостей
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

      <div id="student-organizations">
        <StudentOrganizations />
      </div>
    </main>
  );
}
