'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DIRECTIONS } from '../../../lib/directions';
import { accentBg } from '../../../lib/theme';
import { supabase } from '../../../lib/supabaseClient';
import ContentCard from '../../../components/ContentCard';

function getCasesForDirection(slug: string) {
  const cases: Record<string, Array<{ title: string; description: string; slug: string }>> = {
    legal: [
      {
        title: 'Стипендия не пришла',
        description: 'Проверка причин задержки или удержания стипендии',
        slug: 'scholarship-delayed',
      },
      {
        title: 'Пересдача или апелляция',
        description: 'Помощь в подготовке документов и процедуре апелляции',
        slug: 'appeal-exam',
      },
      {
        title: 'Конфликт с преподавателем',
        description: 'Консультация и помощь в разрешении конфликтной ситуации',
        slug: 'teacher-conflict',
      },
    ],
    infrastructure: [
      {
        title: 'Поломка в общежитии',
        description: 'Ремонт, замена мебели, проблемы с коммуникациями',
        slug: 'dorm-repair',
      },
      {
        title: 'Проблема с аудиторией',
        description: 'Не работает оборудование, неудобства в аудитории',
        slug: 'classroom-issue',
      },
      {
        title: 'Вопросы по кампусу',
        description: 'Инфраструктура, доступность, сервисы кампуса',
        slug: 'campus-service',
      },
    ],
    scholarship: [
      {
        title: 'Не пришла стипендия',
        description: 'Проверка статуса выплаты и причин задержки',
        slug: 'payment-delayed',
      },
      {
        title: 'Вопрос о размере стипендии',
        description: 'Расчёт, условия получения, повышение',
        slug: 'amount-question',
      },
      {
        title: 'Документы для стипендии',
        description: 'Какие документы нужны, куда подавать',
        slug: 'documents-needed',
      },
    ],
    international: [
      {
        title: 'Вопросы по документам',
        description: 'Помощь с оформлением документов для иностранных студентов',
        slug: 'documents-help',
      },
      {
        title: 'Адаптация и коммуникация',
        description: 'Помощь в адаптации, языковые вопросы',
        slug: 'adaptation',
      },
      {
        title: 'Миграционные вопросы',
        description: 'Визы, регистрация, продление документов',
        slug: 'migration',
      },
    ],
  };

  return cases[slug] || [];
}

function getChecklistForDirection(slug: string): string[] {
  const checklists: Record<string, string[]> = {
    legal: [
      'ФИО, группа, институт',
      'Описание ситуации с датами',
      'Копии документов (если есть)',
      'Скриншоты переписки (если применимо)',
      'Номер приказа или распоряжения (если есть)',
    ],
    infrastructure: [
      'Номер корпуса и комнаты/аудитории',
      'Фото или описание проблемы',
      'Дата обнаружения проблемы',
      'Контакт для связи (если нужен доступ)',
    ],
    scholarship: [
      'ФИО, группа, институт',
      'Период, за который не пришла стипендия',
      'Номер зачётной книжки',
      'Скриншот личного кабинета (если доступен)',
    ],
    international: [
      'ФИО, группа, страна',
      'Тип документа (виза, регистрация и т.д.)',
      'Срок действия документа',
      'Копии документов',
    ],
  };

  return (
    checklists[slug] || [
      'Описание проблемы',
      'Контакт для связи',
      'Дополнительные документы (если есть)',
    ]
  );
}

export default function DirectionPage({ params }: { params: { slug: string } }) {
  const direction = DIRECTIONS.find((d) => d.slug === params.slug);
  const [relatedContent, setRelatedContent] = useState<any[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [directionId, setDirectionId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDirectionAndContent() {
      if (!direction) return;

      // Получаем ID направления из БД
      const { data: dirData } = await supabase
        .from('directions')
        .select('id')
        .eq('slug', direction.slug)
        .eq('is_active', true)
        .single();

      if (dirData) {
        setDirectionId(dirData.id);

        // Загружаем связанный контент
        const { data: contentData } = await supabase
          .from('content')
          .select('id, type, title, slug, published_at, direction_id')
          .eq('direction_id', dirData.id)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(6);

        setRelatedContent((contentData as any) || []);
      }
      setLoadingContent(false);
    }

    loadDirectionAndContent();
  }, [direction]);

  if (!direction) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold">Направление не найдено</h1>
        <p className="mt-3 text-white/70">Проверьте ссылку или перейдите к списку направлений.</p>
        <Link className="mt-6 inline-block underline" href="/directions">К направлениям</Link>
      </main>
    );
  }

  const accent = accentBg(direction.colorKey);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className={`rounded-2xl sm:rounded-3xl ${accent} p-6 sm:p-8 md:p-10`}>
        <div className="text-xs uppercase tracking-wide text-white/90 light:text-white/80">
          Направление
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">{direction.title}</h1>
        <p className="mt-4 text-base sm:text-lg text-white/90 max-w-3xl light:text-white/95">{direction.description}</p>
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
          <Link href={`/appeal?direction=${direction.slug}`} className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white text-oss-dark font-semibold hover:bg-white/90 transition text-sm sm:text-base">
            Подать обращение
          </Link>
          <Link href="/content" className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-white/40 text-white hover:bg-white/10 transition text-sm sm:text-base">
            Гайды и новости
          </Link>
          <Link href="/documents" className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-white/40 text-white hover:bg-white/10 transition text-sm sm:text-base">
            Документы
          </Link>
        </div>
      </div>

      <section className="mt-8 sm:mt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 light:text-gray-900">Частые кейсы</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {getCasesForDirection(direction.slug).map((c, i) => (
            <div
              key={i}
              className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer light:bg-white light:border-gray-200 light:hover:bg-gray-50 light:hover:border-gray-300 light:shadow-sm"
              onClick={() => {
                // В будущем можно открыть модалку с алгоритмом или перейти на страницу
              }}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-2 light:text-gray-900">{c.title}</h3>
              <p className="text-sm text-white/70 light:text-gray-600">{c.description}</p>
              <div className="mt-4">
                <Link
                  href={`/appeal?direction=${direction.slug}&case=${c.slug}`}
                  className="text-sm text-white/80 hover:text-white underline light:text-oss-red light:hover:text-oss-red/80"
                >
                  Подать обращение по этому кейсу →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 sm:mt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 light:text-gray-900">Чек-лист: что подготовить</h2>
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <ul className="space-y-2 sm:space-y-3">
            {getChecklistForDirection(direction.slug).map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-oss-red mt-1 flex-shrink-0">✓</span>
                <span className="text-white/80 text-sm sm:text-base light:text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {relatedContent.length > 0 && (
        <section className="mt-8 sm:mt-10">
          <div className="flex items-end justify-between mb-4 sm:mb-6 flex-wrap gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold light:text-gray-900">Материалы по направлению</h2>
            <Link
              href={`/content?direction=${direction.slug}`}
              className="text-xs sm:text-sm text-white/70 hover:text-white transition light:text-gray-600 light:hover:text-gray-900"
            >
              Все материалы →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedContent.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                slug={item.slug}
                type={item.type}
                direction={direction.title}
                publishedAt={item.published_at}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
