import Link from 'next/link';
import { ReactNode } from 'react';

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
  return (
    <div
      data-guide-skin="lisa"
      className={`min-h-screen bg-[#ebebea] text-[#37352f] dark:bg-[#191919] dark:text-[#ececec] ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <nav
          className="mb-6 text-[13px] text-[#787774] dark:text-neutral-500"
          aria-label="Навигация"
        >
          <Link href="/" className="hover:text-[#37352f] dark:hover:text-neutral-200">
            Главная
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/guides/contest" className="hover:text-[#37352f] dark:hover:text-neutral-200">
            Конкурс гайдов
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-[#37352f] dark:text-neutral-300">{title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 lg:items-start">
          <TocNav items={tocItems} />

          <article className="flex-1 min-w-0 rounded-xl border border-[#e3e2e0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#252525] dark:shadow-none px-6 sm:px-10 py-8 sm:py-10">
            {eyebrow && (
              <p className="text-xs font-medium uppercase tracking-wider text-[#9b9a97] dark:text-neutral-500">
                {eyebrow}
              </p>
            )}
            {badge && (
              <span className="mt-2 inline-flex rounded-md bg-[#f1f1ef] px-2 py-0.5 text-xs font-medium text-[#37352f] dark:bg-white/10 dark:text-neutral-200">
                {badge}
              </span>
            )}
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#37352f] dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-base sm:text-lg text-[#787774] dark:text-neutral-400 leading-relaxed">
                {subtitle}
              </p>
            )}
            {metaLine && (
              <p className="mt-4 text-xs text-[#9b9a97] dark:text-neutral-500 border-b border-[#e9e9e7] dark:border-white/10 pb-4">
                {metaLine}
              </p>
            )}

            <div
              className="mt-8 space-y-1
              [&_section]:scroll-mt-28
              [&_section]:mt-8
              [&_h2]:text-lg
              [&_h2]:font-semibold
              [&_h2]:text-[#37352f]
              dark:[&_h2]:text-neutral-100
              [&_p]:mt-3
              [&_p]:text-[15px]
              [&_p]:leading-relaxed
              [&_p]:text-[#37352f]/90
              dark:[&_p]:text-neutral-300
              [&_ul]:mt-2
              [&_ul]:list-disc
              [&_ul]:pl-6
              [&_ul]:space-y-2
              [&_ul]:text-[15px]
              [&_ul]:text-[#37352f]/90
              dark:[&_ul]:text-neutral-300
              [&_ol]:mt-2
              [&_ol]:list-decimal
              [&_ol]:pl-6
              [&_ol]:space-y-2
              [&_ol]:text-[15px]
              [&_strong]:font-semibold
              [&_strong]:text-[#37352f]
              dark:[&_strong]:text-neutral-100"
            >
              {children}
            </div>

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
