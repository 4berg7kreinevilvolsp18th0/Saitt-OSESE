import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Конкурс гайдов · Даник | ОСС ДВФУ',
  description: 'Демо-страница дизайна Даника — в разработке.',
};

export default function ContestDanikPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
      <p className="text-xs uppercase tracking-wide text-white/50 light:text-gray-500">Конкурс дизайнов</p>
      <h1 className="mt-2 text-2xl font-bold light:text-gray-900">Даник</h1>
      <p className="mt-4 text-white/70 light:text-gray-600">
        Макет в работе. После передачи материалов (PNG/Figma) сюда будет подключена отдельная оболочка{' '}
        <code className="text-sm text-oss-red">GuideSkinDanik</code>.
      </p>
      <Link
        href="/guides/contest"
        className="mt-8 inline-block text-sm text-oss-red hover:underline"
      >
        ← К списку конкурса
      </Link>
    </main>
  );
}
