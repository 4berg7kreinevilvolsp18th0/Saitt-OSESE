import Link from 'next/link';
import type { ReactNode } from 'react';
import GuideSkinSwitcher from '../GuideSkinSwitcher';
import { getGuideSkinTokens } from '../../../lib/guideSkinTokens';

export function FaqSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const tokens = getGuideSkinTokens('faq');
  return (
    <details
      id={id}
      className={`scroll-mt-28 group border-b last:border-0 ${tokens.surfaceBorder}`}
    >
      <summary className={`cursor-pointer list-none py-5 pr-8 text-left text-lg font-semibold [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 ${tokens.heading}`}>
        <span>{title}</span>
        <span className="shrink-0 text-gray-400 text-xl leading-none group-open:rotate-45 transition-transform">+</span>
      </summary>
      <div
        className={`pb-6 pl-0 space-y-3 text-[15px] leading-relaxed ${tokens.textPrimary}
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
        [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white`}
      >
        {children}
      </div>
    </details>
  );
}

export function FaqCallout({ title, children }: { title: string; children: ReactNode }) {
  const tokens = getGuideSkinTokens('faq');
  return (
    <div className={`my-4 rounded-xl border px-4 py-3 ${tokens.calloutBg} ${tokens.calloutBorder}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${tokens.calloutTitle}`}>{title}</p>
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

export default function GuideSkinLabFaq({
  title,
  subtitle,
  metaLine,
  badge,
  children,
  className = '',
  conceptLabel,
}: Props) {
  const tokens = getGuideSkinTokens('faq');
  return (
    <div
      data-guide-skin="lab-faq"
      className={`min-h-screen ${tokens.pageBg} ${tokens.pageText} ${className}`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-4">
          <GuideSkinSwitcher currentSkin="faq" />
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

        <header className="mb-2">
          {badge && (
            <span className={`text-xs font-semibold uppercase tracking-wide ${tokens.accent}`}>
              {badge}
            </span>
          )}
          <h1 className={`mt-2 text-3xl sm:text-4xl font-bold ${tokens.heading}`}>{title}</h1>
          {subtitle && <p className={`mt-3 leading-relaxed ${tokens.textSecondary}`}>{subtitle}</p>}
          {metaLine && <p className={`mt-3 text-sm ${tokens.accent}`}>{metaLine}</p>}
        </header>

        <p className={`mb-6 text-sm ${tokens.accent}`}>Раскройте блоки ниже — формат «FAQ-first».</p>

        <div className={`rounded-2xl border px-4 sm:px-6 ${tokens.surfaceBorder} ${tokens.surface}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
