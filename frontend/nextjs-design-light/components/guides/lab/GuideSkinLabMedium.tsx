import Link from 'next/link';
import type { ReactNode } from 'react';
import GuideSkinSwitcher from '../GuideSkinSwitcher';
import { getGuideSkinTokens } from '../../../lib/guideSkinTokens';

export function MediumSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const tokens = getGuideSkinTokens('medium');
  return (
    <section id={id} className="scroll-mt-28 mt-16 first:mt-0">
      <h2 className={`font-serif text-3xl sm:text-[2rem] font-bold leading-tight ${tokens.heading}`}>
        {title}
      </h2>
      <div
        className={`mt-6 space-y-6 text-xl leading-[1.75] font-serif ${tokens.textPrimary}
        [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:space-y-3
        [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:space-y-3
        [&_strong]:font-semibold [&_strong]:text-neutral-900 dark:[&_strong]:text-white`}
      >
        {children}
      </div>
    </section>
  );
}

export function MediumCallout({ title, children }: { title: string; children: ReactNode }) {
  const tokens = getGuideSkinTokens('medium');
  return (
    <blockquote className={`my-8 border-l-4 pl-6 italic ${tokens.textSecondary} ${tokens.calloutBorder}`}>
      <p className={`not-italic text-sm font-sans font-semibold uppercase tracking-wide mb-2 ${tokens.calloutTitle}`}>
        {title}
      </p>
      <div className={`not-italic text-xl leading-[1.75] font-serif ${tokens.heading}`}>{children}</div>
    </blockquote>
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

export default function GuideSkinLabMedium({
  title,
  subtitle,
  metaLine,
  badge,
  children,
  className = '',
  conceptLabel,
}: Props) {
  const tokens = getGuideSkinTokens('medium');
  return (
    <div
      data-guide-skin="lab-medium"
      className={`min-h-screen ${tokens.pageBg} ${tokens.pageText} ${className}`}
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        <div className="mb-4">
          <GuideSkinSwitcher currentSkin="medium" />
        </div>
        <nav className={`mb-10 text-sm font-sans ${tokens.navText}`} aria-label="Навигация">
          <Link href="/" className={tokens.navHover}>
            Главная
          </Link>
          <span className="mx-2">·</span>
          <Link href="/guides/lab" className={tokens.navHover}>
            Лаборатория
          </Link>
          <span className="mx-2">·</span>
          <span>{conceptLabel}</span>
        </nav>

        {badge && (
          <p className={`font-sans text-xs font-medium uppercase tracking-widest ${tokens.accent}`}>
            {badge}
          </p>
        )}
        <h1 className={`mt-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] ${tokens.heading}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`mt-6 text-2xl leading-snug font-serif ${tokens.textSecondary}`}>{subtitle}</p>
        )}
        {metaLine && (
          <p className={`mt-8 font-sans text-sm border-b pb-8 ${tokens.accent} ${tokens.surfaceBorder}`}>
            {metaLine}
          </p>
        )}

        <div className="mt-12">{children}</div>
      </div>
    </div>
  );
}
