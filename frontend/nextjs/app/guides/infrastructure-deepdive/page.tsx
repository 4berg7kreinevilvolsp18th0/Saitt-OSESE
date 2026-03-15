import Link from 'next/link';

export default function InfrastructureDeepdiveGuidePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <article className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 light:bg-white light:border-gray-200 light:shadow-sm">
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300 light:text-sky-700 light:border-sky-200 light:bg-sky-50">
            Демо-гайд (расширенный)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold light:text-gray-900">
          Инфраструктура: эскалация, сроки и шаблоны
        </h1>
        <p className="mt-3 text-white/70 light:text-gray-600">
          Расширенная версия: когда проблема не решается на базовом этапе и нужен понятный план
          эскалации.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Уровни эскалации</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 light:border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-white/10 light:bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Уровень</th>
                  <th className="px-3 py-2 text-left">Куда передаем</th>
                  <th className="px-3 py-2 text-left">Ожидаемый срок</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10 light:border-gray-200">
                  <td className="px-3 py-2">L1</td>
                  <td className="px-3 py-2">Ответственные на месте</td>
                  <td className="px-3 py-2">до 24 часов</td>
                </tr>
                <tr className="border-t border-white/10 light:border-gray-200">
                  <td className="px-3 py-2">L2</td>
                  <td className="px-3 py-2">Профильный блок ОСС</td>
                  <td className="px-3 py-2">1-3 рабочих дня</td>
                </tr>
                <tr className="border-t border-white/10 light:border-gray-200">
                  <td className="px-3 py-2">L3</td>
                  <td className="px-3 py-2">Административная эскалация</td>
                  <td className="px-3 py-2">3-7 рабочих дней</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Шаблон формулировки</h2>
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200">
            <p className="text-white/80 light:text-gray-700">
              <strong>Тема:</strong> Проблема инфраструктуры в корпусе [X], помещение [Y]
            </p>
            <p className="mt-2 text-white/80 light:text-gray-700">
              <strong>Описание:</strong> [что произошло], обнаружено [дата/время], влияет на
              [учебный процесс/условия проживания].
            </p>
            <p className="mt-2 text-white/80 light:text-gray-700">
              <strong>Что уже сделано:</strong> обращение к [ответственный], дата [..], ответ [..].
            </p>
            <p className="mt-2 text-white/80 light:text-gray-700">
              <strong>Просьба:</strong> зафиксировать обращение и сообщить следующий шаг с сроками.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Симптом → действие → канал</h2>
          <ul className="mt-3 space-y-3 text-white/80 light:text-gray-700">
            <li className="rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200">
              <strong>Нет отопления / воды:</strong> локальная фиксация + срочное сообщение в
              профильный канал ОСС.
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200">
              <strong>Проблемы доступа / безопасности:</strong> дежурные службы + параллельная
              передача в ОСС для контроля.
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200">
              <strong>Затяжной нерешенный кейс:</strong> запуск эскалации L2/L3 с приложением
              хронологии.
            </li>
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/guides/infrastructure"
            className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-800 light:border-gray-300 light:hover:bg-gray-100"
          >
            Базовый гайд
          </Link>
          <Link
            href="/content"
            className="rounded-xl bg-oss-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-oss-red/90 transition"
          >
            Перейти в раздел контента
          </Link>
        </div>
      </article>
    </main>
  );
}

