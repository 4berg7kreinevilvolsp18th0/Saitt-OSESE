'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DIRECTIONS } from '../lib/directions';
import DirectionCard from '../components/DirectionCard';
import ContentCard from '../components/ContentCard';
import Logo from '../components/Logo';
import TelegramPosts from '../components/TelegramPosts';
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
    <main className="min-h-screen bg-oss-dark dark:bg-oss-dark light:bg-gray-50 text-white dark:text-white light:text-gray-900">
      <section className="bg-oss-red py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <Logo size={120} color="#FFFFFF" useImage={true} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            ОБЪЕДИНЕННЫЙ СОВЕТ СТУДЕНТОВ
          </h1>
          <p className="text-lg md:text-xl mb-2 text-white/90">
            Дальневосточный федеральный университет
          </p>
          <p className="text-base md:text-lg max-w-3xl mx-auto text-white/80 mb-8">
            Высший орган студенческого самоуправления ДВФУ. Решаем правовые,
            инфраструктурные, стипендиальные, адаптационные и консультационные вопросы.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/appeal" className="px-6 py-3 bg-white text-oss-red font-semibold rounded-xl hover:bg-white/90 transition">
              Подать обращение
            </Link>
            <Link href="/appeal/status" className="px-6 py-3 border border-white/80 rounded-xl hover:bg-white/10 transition">
              Проверить статус
            </Link>
            <Link href="/statistics" className="px-6 py-3 border border-white/80 rounded-xl hover:bg-white/10 transition">
              Статистика
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold">Направления</h2>
            <p className="mt-2 text-white/70 max-w-2xl">
              Цвет каждого раздела — часть навигации: он помогает быстро понять, в каком блоке вы находитесь.
            </p>
          </div>
          <Link href="/directions" className="text-white/70 hover:text-white transition">
            Все направления →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIRECTIONS.map((d) => (
            <DirectionCard key={d.slug} d={d} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white dark:text-white light:text-gray-900">Новости и гайды</h2>
                <p className="mt-2 text-white/70 dark:text-white/70 light:text-gray-600 max-w-2xl">
                  Публикуем актуальную информацию и инструкции по направлениям. Цель — чтобы часть вопросов решалась без обращения.
                </p>
              </div>
              <Link href="/content" className="text-white/70 dark:text-white/70 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition">
                Все материалы →
              </Link>
            </div>

            {supabaseError ? (
              <div className="rounded-3xl border border-yellow-500/50 dark:border-yellow-500/50 light:border-yellow-400 bg-yellow-500/10 dark:bg-yellow-500/10 light:bg-yellow-50 p-8 md:p-10 text-center">
                <div className="text-yellow-400 dark:text-yellow-400 light:text-yellow-600 font-semibold mb-2">⚠️ Предупреждение</div>
                <div className="text-white/80 dark:text-white/80 light:text-gray-800 mb-4">{supabaseError}</div>
                <div className="text-sm text-white/60 dark:text-white/60 light:text-gray-600">
                  Пожалуйста, настройте Supabase согласно инструкции в{' '}
                  <a href="/docs/SUPABASE_SETUP.md" className="text-yellow-400 dark:text-yellow-400 light:text-yellow-600 hover:underline">
                    docs/SUPABASE_SETUP.md
                  </a>
                </div>
              </div>
            ) : loadingNews ? (
              <div className="text-center text-white/50 dark:text-white/50 light:text-gray-500 py-8">Загрузка новостей...</div>
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
              <div className="rounded-3xl border border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 dark:bg-white/5 light:bg-gray-50 p-8 md:p-10 text-center text-white/50 dark:text-white/50 light:text-gray-500">
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
