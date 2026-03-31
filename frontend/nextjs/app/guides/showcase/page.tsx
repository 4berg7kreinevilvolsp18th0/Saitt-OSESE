import Link from 'next/link';

const kpiCards = [
  { label: 'Время первичного ответа', value: 'до 24ч', hint: 'В рабочие дни' },
  { label: 'Средний срок решения', value: '3-7 дней', hint: 'Зависит от кейса' },
  { label: 'Эскалация без ответа', value: '48ч', hint: 'Рекомендуемый порог' },
];

const timeline = [
  { step: 'Шаг 1', title: 'Фиксация кейса', text: 'Соберите факты, фото, время, место и краткое описание.' },
  { step: 'Шаг 2', title: 'Первичное обращение', text: 'Передайте кейс в профильный канал с контактами для связи.' },
  { step: 'Шаг 3', title: 'Контроль статуса', text: 'Проверьте статус в согласованный срок и уточните следующий шаг.' },
  { step: 'Шаг 4', title: 'Эскалация', text: 'Если срок нарушен — эскалируйте с полной хронологией.' },
];

const faq = [
  {
    q: 'Можно ли подать кейс без фото?',
    a: 'Да, но наличие фото/видео обычно ускоряет верификацию и снижает число уточнений.',
  },
  {
    q: 'Когда лучше эскалировать?',
    a: 'Если нет ответа в согласованный срок или есть риск для безопасности/здоровья.',
  },
  {
    q: 'Где отслеживать обновления?',
    a: 'В профильном канале ОСС и в разделе материалов на портале.',
  },
];

export default function ShowcaseGuidePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 sm:p-8 light:bg-white light:border-gray-200 light:shadow-sm">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center rounded-full border border-fuchsia-300/40 bg-fuchsia-500/15 px-3 py-1 text-xs font-semibold text-fuchsia-200 light:text-fuchsia-700 light:border-fuchsia-200 light:bg-fuchsia-50">
            Тестовый гайд
          </span>
          <span className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-200 light:text-cyan-700 light:border-cyan-200 light:bg-cyan-50">
            Showcase
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold light:text-gray-900">
          Дизайн-витрина гайда: все элементы в одном шаблоне
        </h1>
        <p className="mt-3 text-white/75 light:text-gray-600">
          Демонстрационный материал для проверки визуального языка портала: пометки, инфоблоки,
          таблицы, выноски, таймлайн, чеклисты и FAQ.
        </p>

        <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {kpiCards.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-oss-red/20 to-violet-500/20 p-4 light:from-red-50 light:to-violet-50 light:border-gray-200"
            >
              <p className="text-xs text-white/60 light:text-gray-500">{kpi.label}</p>
              <p className="mt-1 text-xl font-bold text-white light:text-gray-900">{kpi.value}</p>
              <p className="mt-1 text-xs text-white/70 light:text-gray-600">{kpi.hint}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-amber-300/40 bg-amber-500/10 p-4 light:border-amber-200 light:bg-amber-50">
          <p className="text-sm font-semibold text-amber-200 light:text-amber-800">Выноска (Важно)</p>
          <p className="mt-1 text-sm text-white/80 light:text-amber-900">
            Этот гайд — тестовый шаблон для визуальной оценки. Контент можно адаптировать под любой
            комитет без изменения структуры страницы.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Таймлайн работы с кейсом</h2>
          <div className="mt-4 space-y-3">
            {timeline.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200"
              >
                <p className="text-xs uppercase tracking-wider text-cyan-200 light:text-cyan-700">{item.step}</p>
                <p className="mt-1 font-semibold text-white light:text-gray-900">{item.title}</p>
                <p className="mt-1 text-sm text-white/75 light:text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Таблица: симптом → действие → канал</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 light:border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-white/10 light:bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Симптом</th>
                  <th className="px-3 py-2 text-left">Действие</th>
                  <th className="px-3 py-2 text-left">Канал</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10 light:border-gray-200">
                  <td className="px-3 py-2">Срочная инфраструктурная поломка</td>
                  <td className="px-3 py-2">Фиксация + немедленное уведомление</td>
                  <td className="px-3 py-2">Контакты ОСС + Telegram</td>
                </tr>
                <tr className="border-t border-white/10 light:border-gray-200">
                  <td className="px-3 py-2">Нет обратной связи</td>
                  <td className="px-3 py-2">Эскалация с хронологией</td>
                  <td className="px-3 py-2">Профильный комитет</td>
                </tr>
                <tr className="border-t border-white/10 light:border-gray-200">
                  <td className="px-3 py-2">Нужны документы/шаблон</td>
                  <td className="px-3 py-2">Взять шаблон обращения</td>
                  <td className="px-3 py-2">Раздел «Контент»</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/10 p-4 light:border-emerald-200 light:bg-emerald-50">
            <p className="font-semibold text-emerald-200 light:text-emerald-800">Чеклист перед отправкой</p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-white/80 light:text-emerald-900">
              <li>Описание проблемы в 2-3 предложениях</li>
              <li>Фото/скрин/видео при наличии</li>
              <li>Место, дата, время</li>
              <li>Контакт для обратной связи</li>
            </ul>
          </div>
          <div className="rounded-xl border border-sky-300/40 bg-sky-500/10 p-4 light:border-sky-200 light:bg-sky-50">
            <p className="font-semibold text-sky-200 light:text-sky-800">Пометка по тону коммуникации</p>
            <p className="mt-2 text-sm text-white/80 light:text-sky-900">
              Пишите нейтрально и по фактам: меньше эмоций, больше конкретики и хронологии. Это
              ускоряет обработку и повышает качество решения.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">FAQ (раскрывающиеся блоки)</h2>
          <div className="mt-3 space-y-2">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-white/10 bg-white/5 p-4 open:bg-white/10 light:bg-gray-50 light:border-gray-200 light:open:bg-gray-100"
              >
                <summary className="cursor-pointer list-none font-semibold text-white light:text-gray-900">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-white/75 light:text-gray-700">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <blockquote className="mt-8 rounded-xl border-l-4 border-oss-red bg-white/5 p-4 italic text-white/80 light:bg-gray-50 light:text-gray-700">
          «Хороший гайд не только объясняет, что делать, но и снижает тревожность за счет
          прозрачного маршрута действий».
        </blockquote>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/content"
            className="rounded-xl bg-oss-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-oss-red/90 transition"
          >
            Перейти в раздел контента
          </Link>
          <Link
            href="/guides/infrastructure-deepdive"
            className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-800 light:border-gray-300 light:hover:bg-gray-100"
          >
            Сравнить с инфра-гайдом
          </Link>
        </div>
      </article>
    </main>
  );
}

