import Link from 'next/link';
import { ReactNode } from 'react';
import GuideSkinSwitcher from '../GuideSkinSwitcher';
import { getGuideSkinTokens } from '../../../lib/guideSkinTokens';

export function LisaSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const tokens = getGuideSkinTokens('lisa');
  return (
    <section id={id} className="scroll-mt-28 mt-10 first:mt-0">
      <h2 className={`text-lg font-semibold ${tokens.heading}`}>{title}</h2>
      <div
        className={`mt-3 space-y-3 text-[15px] leading-relaxed ${tokens.textPrimary}
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
        [&_strong]:font-semibold [&_strong]:text-[#37352f] dark:[&_strong]:text-neutral-100`}
      >
        {children}
      </div>
    </section>
  );
}

export function LisaCallout({ title, children }: { title: string; children: ReactNode }) {
  const tokens = getGuideSkinTokens('lisa');
  return (
    <div className={`rounded-lg border px-4 py-3 ${tokens.calloutBorder} ${tokens.calloutBg}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${tokens.calloutTitle}`}>
        {title}
      </p>
      <div className={`mt-2 text-[15px] leading-relaxed ${tokens.textPrimary}`}>{children}</div>
    </div>
  );
}

export type GuideSkinLisaTocItem = {
  id: string;
  title: string;
  level?: 2 | 3;
};

type GuideSkinLisaProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  metaLine?: string;
  badge?: string;
  tocItems: GuideSkinLisaTocItem[];
  children: ReactNode;
  /** Для анимаций и кастомных селекторов (Олежа и др.) */
  className?: string;
  /** Референс-макеты под страницей (опционально) */
  showReferenceStrip?: boolean;
};

function TocNav({ items }: { items: GuideSkinLisaTocItem[] }) {
  if (!items.length) return null;

  const linkClass =
    'text-[13px] leading-snug text-[#787774] hover:text-[#37352f] transition-colors dark:text-neutral-500 dark:hover:text-neutral-200';

  return (
    <>
      <aside className="hidden lg:block w-56 shrink-0 xl:w-64">
        <nav
          className="sticky top-24 pr-4 border-r border-[#e9e9e7] dark:border-white/10"
          aria-label="Содержание"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9b9a97] dark:text-neutral-500 mb-3">
            Содержание
          </p>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`${linkClass} ${item.level === 3 ? 'pl-3 block' : 'block'}`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <details className="lg:hidden mb-6 rounded-lg border border-[#e9e9e7] bg-white px-4 py-3 dark:border-white/10 dark:bg-[#2c2c2c]">
        <summary className="cursor-pointer text-sm font-semibold text-[#37352f] dark:text-neutral-200">
          Содержание
        </summary>
        <ul className="mt-3 space-y-2 pb-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${linkClass} ${item.level === 3 ? 'pl-3 block' : 'block'}`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}

export default function GuideSkinLisa({
  title,
  eyebrow = 'Конкурс дизайнов · Лиза · Younote',
  subtitle,
  metaLine,
  badge,
  tocItems,
  children,
  className = '',
  showReferenceStrip = false,
}: GuideSkinLisaProps) {
  const tokens = getGuideSkinTokens('lisa');
  return (
    <div
      data-guide-skin="lisa"
      className={`min-h-screen ${tokens.pageBg} ${tokens.pageText} ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-4">
          <GuideSkinSwitcher currentSkin="lisa" />
        </div>
        <nav
          className={`mb-6 text-[13px] ${tokens.navText}`}
          aria-label="Навигация"
        >
          <Link href="/" className={tokens.navHover}>
            Главная
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/guides/contest" className={tokens.navHover}>
            Конкурс гайдов
          </Link>
          <span className="mx-1.5">/</span>
          <span className={tokens.heading}>{title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 lg:items-start">
          <TocNav items={tocItems} />

          <article className={`flex-1 min-w-0 rounded-xl border shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none px-6 sm:px-10 py-8 sm:py-10 ${tokens.surfaceBorder} ${tokens.surface}`}>
            {eyebrow && (
              <p className={`text-xs font-medium uppercase tracking-wider ${tokens.accent}`}>
                {eyebrow}
              </p>
            )}
            {badge && (
              <span className={`mt-2 inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${tokens.chip}`}>
                {badge}
              </span>
            )}
            <h1 className={`mt-3 text-3xl sm:text-4xl font-bold tracking-tight ${tokens.heading}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`mt-3 text-base sm:text-lg leading-relaxed ${tokens.textSecondary}`}>
                {subtitle}
              </p>
            )}
            {metaLine && (
              <p className={`mt-4 text-xs border-b pb-4 ${tokens.accent} ${tokens.calloutBorder}`}>
                {metaLine}
              </p>
            )}

            <div className="mt-8">{children}</div>

            {showReferenceStrip && (
              <div className="mt-12 pt-8 border-t border-[#e9e9e7] dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#9b9a97] dark:text-neutral-500 mb-3">
                  Референс-макеты Younote (4 части)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['part-1', 'part-2', 'part-3', 'part-4'] as const).map((name) => (
                    <a
                      key={name}
                      href={`/guides/contest/lisa/${name}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-lg border border-[#e9e9e7] dark:border-white/10 bg-[#f7f6f3] dark:bg-black/20"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/guides/contest/lisa/${name}.png`}
                        alt={`Макет ${name}`}
                        className="w-full h-24 object-cover object-top opacity-90 hover:opacity-100 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
