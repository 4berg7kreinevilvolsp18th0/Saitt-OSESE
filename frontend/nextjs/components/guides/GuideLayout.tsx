'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import GuideToc from './GuideToc';
import GuideBreadcrumbs from './GuideBreadcrumbs';
import GuideShare from './GuideShare';
import { GuideMeta } from '../../lib/guides';
import { trackGuideEvent } from '../../lib/guideAnalytics';
import { committeeBadgeClasses } from '../../lib/theme';

type TocItem = {
  id: string;
  title: string;
  level?: 2 | 3;
};

export default function GuideLayout({
  meta,
  summary,
  badges,
  tocItems,
  children,
}: {
  meta: GuideMeta;
  summary: string;
  badges?: string[];
  tocItems: TocItem[];
  children: ReactNode;
}) {
  const [scrollMarks, setScrollMarks] = useState<number[]>([]);

  const publishedStatusVisible = process.env.NODE_ENV !== 'production';
  const depthMarks = useMemo(() => [25, 50, 75, 100], []);
  const committeeClasses = committeeBadgeClasses(meta.colorKey);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) return;
      const depth = Math.round((window.scrollY / total) * 100);
      depthMarks.forEach((mark) => {
        if (depth >= mark && !scrollMarks.includes(mark)) {
          setScrollMarks((prev) => [...prev, mark]);
          trackGuideEvent('guide_scroll_depth', { slug: meta.slug, depth: mark });
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [depthMarks, meta.slug, scrollMarks]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <GuideBreadcrumbs title={meta.title} />
      <div className="flex flex-col lg:flex-row gap-6">
        <article className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="mb-4 flex flex-wrap gap-2">
            {(badges || []).map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 light:text-gray-700 light:border-gray-300 light:bg-gray-100"
              >
                {badge}
              </span>
            ))}
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${committeeClasses}`}>
              {meta.committee}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold light:text-gray-900">{meta.title}</h1>
          <p className="mt-3 text-white/70 light:text-gray-600">{summary}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/60 light:text-gray-500">
            <span>Актуально на: {meta.updatedAt}</span>
            <span>Проверено комитетом: {meta.committee}</span>
            <span>Уровень: {meta.level === 'deepdive' ? 'Расширенный' : 'Базовый'}</span>
            {publishedStatusVisible && <span>Статус: {meta.status}</span>}
          </div>

          <GuideShare slug={meta.slug} title={meta.title} />

          <div className="mt-8">{children}</div>
        </article>

        <GuideToc items={tocItems} />
      </div>
    </main>
  );
}

