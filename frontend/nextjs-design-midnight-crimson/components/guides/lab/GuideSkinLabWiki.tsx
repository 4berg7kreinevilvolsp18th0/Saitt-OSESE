import Link from 'next/link';
import type { ReactNode } from 'react';
import GuideSkinSwitcher from '../GuideSkinSwitcher';
import { getGuideSkinTokens } from '../../../lib/guideSkinTokens';

export function WikiSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const tokens = getGuideSkinTokens('wiki');
  return (
    <section id={id} className={`scroll-mt-28 mt-12 first:mt-0 border-t pt-8 first:border-0 first:pt-0 ${tokens.surfaceBorder}`}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className={`text-xl font-bold ${tokens.heading}`}>{title}</h2>
        <span className="rounded bg-sky-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-sky-800 dark:bg-sky-900/40 dark:text-sky-200">
          раздел
        </span>
      </div>
      <div
        className={`mt-4 space-y-3 text-[15px] leading-relaxed ${tokens.textPrimary}
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
        [&_strong]:font-semibold [&_strong]:text-slate-900 dark:[&_strong]:text-white`}
      >
        {children}
      </div>
    </section>
  );
}

export function WikiCallout({ title, children }: { title: string; children: ReactNode }) {
  const tokens = getGuideSkinTokens('wiki');
  return (
    <div className={`my-4 overflow-hidden rounded-lg border ${tokens.calloutBorder} ${tokens.calloutBg}`}>
      <div className={`border-b px-4 py-2 text-xs font-bold uppercase tracking-wide ${tokens.calloutBorder} ${tokens.calloutTitle}`}>
        {title}
      </div>
      <div className={`px-4 py-3 text-[15px] leading-relaxed ${tokens.textPrimary}`}>{children}</div>
    </div>
  );
}

export type LabTocItem = { id: string; title: string };

type Props = {
  title: string;
  subtitle?: string;
  metaLine?: string;
  badge?: string;
  tocItems: readonly LabTocItem[];
  children: ReactNode;
  className?: string;
  conceptSlug: string;
  conceptLabel: string;
};

function TocNav({ items }: { items: readonly LabTocItem[] }) {
  if (!items.length) return null;
  const linkClass =
    'text-sm text-slate-600 hover:text-sky-700 dark:text-slate-400 dark:hover:text-sky-300';

  return (
    <>
      <aside className="hidden lg:block w-56 shrink-0">
        <nav
          className="sticky top-24 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#1e293b]"
          aria-label="Содержание"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">На этой странице</p>
          <ul className="mt-3 space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={`${linkClass} block`}>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <details className="lg:hidden mb-6 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#1e293b]">
        <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-white">Содержание</summary>
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={`${linkClass} block`}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}

export default function GuideSkinLabWiki({
  title,
  subtitle,
  metaLine,
  badge,
  tocItems,
  children,
  className = '',
  conceptSlug,
  conceptLabel,
}: Props) {
  const tokens = getGuideSkinTokens('wiki');
  return (
    <div
      data-guide-skin="lab-wiki"
      className={`min-h-screen ${tokens.pageBg} ${tokens.pageText} ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-4">
          <GuideSkinSwitcher currentSkin="wiki" />
        </div>
        <nav className={`mb-6 text-sm ${tokens.navText}`} aria-label="Навигация">
          <Link href="/" className={tokens.navHover}>
            Главная
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/guides/lab" className={tokens.navHover}>
            Лаборатория
          </Link>
          <span className="mx-1.5">/</span>
          <span className={tokens.accent}>{conceptLabel}</span>
          <span className="mx-1.5">/</span>
          <span className={tokens.heading}>{title}</span>
        </nav>

        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200">
            wiki
          </span>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
            право
          </span>
          <span className="rounded-full bg-violet-100 px-2.5 py-1 font-medium text-violet-900 dark:bg-violet-900/30 dark:text-violet-200">
            комиссия
          </span>
        </div>

        <div className={`rounded-lg border px-4 py-3 text-sm shadow-sm ${tokens.calloutBorder} ${tokens.surface} ${tokens.textSecondary}`}>
          <span className={`font-semibold ${tokens.heading}`}>Версия документа:</span> 1.0 (лаборатория) ·{' '}
          <span className={`font-semibold ${tokens.heading}`}>Концепт:</span> {conceptSlug}
        </div>

        <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:items-start">
          <TocNav items={tocItems} />
          <article className={`flex-1 min-w-0 rounded-xl border-2 shadow-sm px-6 sm:px-10 py-8 sm:py-10 ${tokens.surfaceBorder} ${tokens.surface}`}>
            {badge && (
              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${tokens.surfaceBorder} ${tokens.chip}`}>
                {badge}
              </span>
            )}
            <h1 className={`mt-2 text-3xl sm:text-4xl font-bold tracking-tight ${tokens.heading}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`mt-3 text-lg leading-relaxed ${tokens.textSecondary}`}>{subtitle}</p>
            )}
            {metaLine && <p className={`mt-4 text-xs border-b pb-4 ${tokens.accent} ${tokens.surfaceBorder}`}>{metaLine}</p>}
            <div className="mt-8">{children}</div>
          </article>
        </div>
      </div>
    </div>
  );
}
