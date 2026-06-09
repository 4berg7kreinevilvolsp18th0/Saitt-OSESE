'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import GuideToc from './GuideToc';
import GuideBreadcrumbs from './GuideBreadcrumbs';
import GuideShare from './GuideShare';
import GuideSkinSwitcher from './GuideSkinSwitcher';
import { GuideMeta } from '../../lib/guides';
import { trackGuideEvent } from '../../lib/guideAnalytics';
import { committeeBadgeClasses } from '../../lib/theme';
import { DEFAULT_GUIDE_SKIN, getStoredGuideSkin, resolveSkin, type GuideSkinId } from '../../lib/guideSkins';
import { getGuideSkinTokens } from '../../lib/guideSkinTokens';

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
  const [currentSkin, setCurrentSkin] = useState<GuideSkinId>(DEFAULT_GUIDE_SKIN);

  useEffect(() => {
    const querySkin =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('skin') : null;
    const resolved = resolveSkin({
      querySkin,
      storedSkin: getStoredGuideSkin(),
      fallback: DEFAULT_GUIDE_SKIN,
    });
    setCurrentSkin(resolved);
  }, []);

  const skinTokens = getGuideSkinTokens(currentSkin);

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
    <main className={`max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 ${skinTokens.pageText}`}>
      <GuideBreadcrumbs title={meta.title} />
      <div className="mb-4">
        <GuideSkinSwitcher currentSkin={currentSkin} />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <article className={`flex-1 rounded-2xl border p-6 sm:p-8 light:shadow-sm ${skinTokens.surfaceBorder} ${skinTokens.surface}`}>
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

          <h1 className={`text-2xl sm:text-3xl font-bold ${skinTokens.heading}`}>{meta.title}</h1>
          <p className={`mt-3 ${skinTokens.textSecondary}`}>{summary}</p>

          <div className={`mt-4 flex flex-wrap items-center gap-3 text-xs ${skinTokens.accent}`}>
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

