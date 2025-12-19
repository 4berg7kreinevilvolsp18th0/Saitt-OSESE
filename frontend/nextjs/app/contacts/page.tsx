import Link from 'next/link';
import { DIRECTIONS } from '../../lib/directions';
import Badge from '../../components/Badge';

export default function ContactsPage() {
  const emergencyContacts = [
    {
      title: 'Экстренная связь',
      contact: 'telegram@oss_dvfu',
      description: 'Для срочных вопросов',
      type: 'emergency',
    },
    {
      title: 'Общий email',
      contact: 'oss@dvfu.ru',
      description: 'Для общих вопросов',
      type: 'general',
    },
  ];

  const directionContacts = DIRECTIONS.map((dir) => ({
    title: dir.title,
    slug: dir.slug,
    contact: `telegram@${dir.slug}_committee`,
    description: dir.description,
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-semibold light:text-gray-900">Контакты</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 max-w-3xl light:text-gray-600">
        Единый справочник контактов ОСС ДВФУ. Для подачи обращения используйте форму на сайте.
      </p>

      <section className="mt-8 sm:mt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 light:text-gray-900">Основные контакты</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {emergencyContacts.map((contact, i) => (
            <div
              key={i}
              className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={contact.type === 'emergency' ? 'error' : 'info'}>
                  {contact.type === 'emergency' ? 'Срочно' : 'Общее'}
                </Badge>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 light:text-gray-900">{contact.title}</h3>
              <p className="text-white/80 font-mono text-xs sm:text-sm mb-2 light:text-gray-700 break-all">{contact.contact}</p>
              <p className="text-xs sm:text-sm text-white/60 light:text-gray-600">{contact.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 sm:mt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 light:text-gray-900">Контакты по направлениям</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {directionContacts.map((dir) => (
            <Link
              key={dir.slug}
              href={`/directions/${dir.slug}`}
              className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-200 light:bg-white light:border-gray-200 light:hover:bg-gray-50 light:hover:border-gray-300 light:shadow-sm"
            >
              <h3 className="text-base sm:text-lg font-semibold mb-2 light:text-gray-900">{dir.title}</h3>
              <p className="text-white/80 font-mono text-xs sm:text-sm mb-2 light:text-gray-700 break-all">{dir.contact}</p>
              <p className="text-xs sm:text-sm text-white/60 light:text-gray-600">{dir.description}</p>
              <div className="mt-4 text-xs sm:text-sm text-white/70 light:text-gray-500">
                Перейти к направлению →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 sm:mt-10 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 light:text-gray-900">Как связаться</h2>
        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-white/80 light:text-gray-700">
          <p>
            <strong>Для обращений:</strong> Используйте форму{' '}
            <Link href="/appeal" className="text-oss-red underline hover:text-oss-red/80">
              подачи обращения
            </Link>
            . Это самый быстрый способ получить помощь.
          </p>
          <p>
            <strong>Для общих вопросов:</strong> Напишите в Telegram или на email.
          </p>
          <p>
            <strong>Для срочных вопросов:</strong> Используйте экстренный контакт.
          </p>
        </div>
      </section>
    </main>
  );
}
