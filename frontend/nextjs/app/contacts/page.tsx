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
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold">Контакты</h1>
      <p className="mt-3 text-white/70 max-w-3xl">
        Единый справочник контактов ОСС ДВФУ. Для подачи обращения используйте форму на сайте.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">Основные контакты</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={contact.type === 'emergency' ? 'error' : 'info'}>
                  {contact.type === 'emergency' ? 'Срочно' : 'Общее'}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-1">{contact.title}</h3>
              <p className="text-white/80 font-mono text-sm mb-2">{contact.contact}</p>
              <p className="text-sm text-white/60">{contact.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">Контакты по направлениям</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {directionContacts.map((dir) => (
            <Link
              key={dir.slug}
              href={`/directions/${dir.slug}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
            >
              <h3 className="text-lg font-semibold mb-2">{dir.title}</h3>
              <p className="text-white/80 font-mono text-sm mb-2">{dir.contact}</p>
              <p className="text-sm text-white/60">{dir.description}</p>
              <div className="mt-4 text-sm text-white/70">
                Перейти к направлению →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4">Как связаться</h2>
        <div className="space-y-3 text-white/80">
          <p>
            <strong>Для обращений:</strong> Используйте форму{' '}
            <Link href="/appeal" className="text-oss-red underline">
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
