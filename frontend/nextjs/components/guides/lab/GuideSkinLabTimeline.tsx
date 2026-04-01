import Link from 'next/link';
import type { ReactNode } from 'react';
import GuideSkinSwitcher from '../GuideSkinSwitcher';
import { getGuideSkinTokens } from '../../../lib/guideSkinTokens';

export function TimelineSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const tokens = getGuideSkinTokens('timeline');
  return (
    <section id={id} className="scroll-mt-28 relative pl-8 sm:pl-10 pb-12 last:pb-0">
      <span
        className="absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-oss-red bg-white dark:bg-zinc-900 dark:border-oss-red"
        aria-hidden
      />
      <h2 className={`text-lg font-bold ${tokens.heading}`}>{title}</h2>
      <div
        className={`mt-3 space-y-3 text-[15px] leading-relaxed ${tokens.textPrimary}
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2
        [&_strong]:font-semibold [&_strong]:text-zinc-900 dark:[&_strong]:text-white`}
      >
        {children}
      </div>
    </section>
  );
}

export function TimelineCallout({ title, children }: { title: string; children: ReactNode }) {
  const tokens = getGuideSkinTokens('timeline');
  return (
    <div className={`my-4 rounded-r-lg border-l-4 px-4 py-3 ${tokens.calloutBorder} ${tokens.calloutBg}`}>
      <p className={`text-xs font-bold uppercase tracking-wide ${tokens.calloutTitle}`}>{title}</p>
      <div className={`mt-2 text-[15px] leading-relaxed ${tokens.textPrimary}`}>{children}</div>
    </div>
  );
}

type Props = {
  title: string;
  subtitle?: string;
  metaLine?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
  conceptLabel: string;
};

export default function GuideSkinLabTimeline({
  title,
  subtitle,
  metaLine,
  badge,
  children,
  className = '',
  conceptLabel,
}: Props) {
  const tokens = getGuideSkinTokens('timeline');
  return (
    <div
      data-guide-skin="lab-timeline"
      className={`min-h-screen ${tokens.pageBg} ${tokens.pageText} ${className}`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-4">
          <GuideSkinSwitcher currentSkin="timeline" />
        </div>
        <nav className={`mb-8 text-sm ${tokens.navText}`} aria-label="Навигация">
          <Link href="/" className={tokens.navHover}>
            Главная
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/guides/lab" className={tokens.navHover}>
            Лаборатория
          </Link>
          <span className="mx-1.5">/</span>
          <span>{conceptLabel}</span>
        </nav>

        <header className="mb-10">
          {badge && (
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${tokens.chip}`}>
              {badge}
            </span>
          )}
          <h1 className={`mt-3 text-3xl sm:text-4xl font-bold ${tokens.heading}`}>{title}</h1>
          {subtitle && <p className={`mt-3 text-base leading-relaxed ${tokens.textSecondary}`}>{subtitle}</p>}
          {metaLine && <p className={`mt-4 text-xs ${tokens.accent}`}>{metaLine}</p>}
        </header>

        <div className="relative border-l-2 border-zinc-200 dark:border-zinc-700 ml-1.5 sm:ml-2">
          {children}
        </div>
      </div>
    </div>
  );
}
