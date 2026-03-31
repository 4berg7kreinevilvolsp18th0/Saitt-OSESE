import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Конкурс дизайнов гайдов | ОСС ДВФУ',
  description: 'Демо-страницы четырёх дизайнеров для жюри конкурса оформления гайдов.',
};

const entries = [
  {
    slug: '/guides/contest/lisa/disputes-commission',
    name: 'Лиза',
    note: 'Готовый гайд «Комиссия по спорам» в стиле Younote + референс-PNG',
    ready: true,
  },
  {
    slug: '/guides/contest/danik',
    name: 'Даник',
    note: 'Макет в работе — скоро',
    ready: false,
  },
  {
    slug: '/guides/contest/german',
    name: 'Герман',
    note: 'Макет в работе — скоро',
    ready: false,
  },
  {
    slug: '/guides/contest/oledja',
    name: 'Олежа (Oledja)',
    note: 'Анимации и расширенный инструментарий — см. docs/GUIDE_SKIN_TOOLKIT.md',
    ready: false,
  },
];

export default function ContestGuidesIndexPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/50 light:text-gray-500">
        ОСС ДВФУ
      </p>
      <h1 className="mt-2 text-2xl sm:text-3xl font-bold light:text-gray-900">Конкурс дизайнов гайдов</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 light:text-gray-600">
        Отдельные демо-маршруты для сравнения. Основные гайды портала остаются в разделе{' '}
        <Link href="/content" className="text-oss-red hover:underline">
          Контент
        </Link>
        .
      </p>
      <ul className="mt-8 space-y-3">
        {entries.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.slug}
              className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 light:border-gray-200 light:bg-white light:hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-semibold text-white light:text-gray-900">{item.name}</span>
                  {item.ready && (
                    <span className="ml-2 text-xs font-medium text-emerald-400 light:text-emerald-600">
                      готово
                    </span>
                  )}
                  <p className="mt-1 text-sm text-white/65 light:text-gray-600">{item.note}</p>
                </div>
                <span className="text-white/40 light:text-gray-400 shrink-0">→</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
