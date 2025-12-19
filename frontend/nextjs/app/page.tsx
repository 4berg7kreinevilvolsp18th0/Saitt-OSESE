'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DIRECTIONS } from '../lib/directions';
import DirectionCard from '../components/DirectionCard';
import ContentCard from '../components/ContentCard';
import Logo from '../components/Logo';
import TelegramPosts from '../components/TelegramPosts';
import StudentOrganizations from '../components/StudentOrganizations';
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
    <main className="min-h-screen bg-oss-dark text-white">
      <section className="bg-oss-red py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="sm:hidden">
              <Logo size={80} color="#FFFFFF" useImage={true} />
            </div>
            <div className="hidden sm:block">
              <Logo size={120} color="#FFFFFF" useImage={true} />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            ОБЪЕДИНЕННЫЙ СОВЕТ СТУДЕНТОВ
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-2 text-white/90">
            Дальневосточный федеральный университет
          </p>
          <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto text-white/80 mb-6 sm:mb-8 px-4">
            Высший орган студенческого самоуправления ДВФУ. Решаем правовые,
            инфраструктурные, стипендиальные, адаптационные и консультационные вопросы.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
            <Link href="/appeal" className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-oss-red font-semibold rounded-xl hover:bg-white/90 transition text-sm sm:text-base">
              Подать обращение
            </Link>
            <Link href="/appeal/status" className="px-5 sm:px-6 py-2.5 sm:py-3 border border-white/80 rounded-xl hover:bg-white/10 transition text-sm sm:text-base">
              Проверить статус
            </Link>
            <Link href="/statistics" className="px-5 sm:px-6 py-2.5 sm:py-3 border border-white/80 rounded-xl hover:bg-white/10 transition text-sm sm:text-base">
              Статистика
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Направления</h2>
            <p className="mt-2 text-sm sm:text-base text-white/70 max-w-2xl">
              Цвет каждого раздела — часть навигации: он помогает быстро понять, в каком блоке вы находитесь.
            </p>
          </div>
          <Link href="/directions" className="text-sm sm:text-base text-white/70 hover:text-white transition whitespace-nowrap">
            Все направления →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DIRECTIONS.map((d) => (
            <DirectionCard key={d.slug} d={d} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Новости и гайды</h2>
                <p className="mt-2 text-white/70 max-w-2xl">
                  Публикуем актуальную информацию и инструкции по направлениям. Цель — чтобы часть вопросов решалась без обращения.
                </p>
              </div>
              <Link href="/content" className="text-white/70 hover:text-white transition">
                Все материалы →
              </Link>
            </div>

            {supabaseError ? (
              <div className="rounded-3xl border border-yellow-500/50 bg-yellow-500/10 p-8 md:p-10 text-center">
                <div className="text-yellow-400 font-semibold mb-2">⚠️ Предупреждение</div>
                <div className="text-white/80 mb-4">{supabaseError}</div>
                <div className="text-sm text-white/60">
                  Пожалуйста, настройте Supabase согласно инструкции в{' '}
                  <a href="/docs/SUPABASE_SETUP.md" className="text-yellow-400 hover:underline">
                    docs/SUPABASE_SETUP.md
                  </a>
                </div>
              </div>
            ) : loadingNews ? (
              <div className="text-center text-white/50 py-8">Загрузка новостей...</div>
            ) : latestNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 text-center text-white/50">
                Пока нет опубликованных новостей
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <TelegramPosts limit={3} />
          </div>
        </div>
      </section>
    </main>
  );
}
