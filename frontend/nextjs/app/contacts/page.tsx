import Link from 'next/link';
import { DIRECTIONS } from '../../lib/directions';
import { TELEGRAM_CHANNEL_URL, TELEGRAM_CONTACT, TELEGRAM_CONTACT_URL } from '../../lib/publicContacts';

const contactCardClass =
  'block rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 transition ' +
  'hover:bg-white/10 focus-ring light:bg-white light:border-gray-200 light:hover:bg-gray-50';

export default function ContactsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-semibold light:text-gray-900">Контакты ОСС ДВФУ</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 max-w-3xl light:text-gray-600">
        Если нужен совет или помощь с вопросом, напишите ОСС в Telegram.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <a href={TELEGRAM_CONTACT_URL} target="_blank" rel="noopener noreferrer" className={contactCardClass}>
          <span className="block text-base sm:text-lg font-semibold light:text-gray-900">Написать в ОСС ↗</span>
          <span className="block mt-2 text-sm text-white/75 light:text-gray-600">@{TELEGRAM_CONTACT}</span>
        </a>
        <a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className={contactCardClass}>
          <span className="block text-base sm:text-lg font-semibold light:text-gray-900">Открыть канал ОСС ↗</span>
          <span className="block mt-2 text-sm text-white/75 light:text-gray-600">Новости, анонсы и актуальный контакт совета.</span>
        </a>
      </div>

      <section className="mt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 light:text-gray-900">Помощь по направлениям</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DIRECTIONS.map((direction) => (
            <Link key={direction.slug} href={`/directions/${direction.slug}`} className={contactCardClass}>
              <h3 className="text-base sm:text-lg font-semibold mb-2 light:text-gray-900">{direction.title}</h3>
              <p className="text-sm text-white/70 light:text-gray-600">{direction.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
