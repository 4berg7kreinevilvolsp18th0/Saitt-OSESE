import Link from 'next/link';

export default function InfrastructureGuidePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <article className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 light:bg-white light:border-gray-200 light:shadow-sm">
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 light:text-emerald-700 light:border-emerald-200 light:bg-emerald-50">
            Демо-гайд
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold light:text-gray-900">
          Инфраструктура: базовый алгоритм действий
        </h1>
        <p className="mt-3 text-white/70 light:text-gray-600">
          Короткий сценарий для ситуаций с общежитием, аудиториями, бытовыми условиями и
          инфраструктурой кампуса.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Когда использовать этот гайд</h2>
          <ul className="mt-3 list-disc pl-6 space-y-2 text-white/80 light:text-gray-700">
            <li>Не работает оборудование в корпусе или общежитии.</li>
            <li>Есть вопросы по санитарному состоянию, доступности, безопасности.</li>
            <li>Нужна понятная маршрутизация: куда писать сначала, а куда эскалировать потом.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Что подготовить заранее</h2>
          <ol className="mt-3 list-decimal pl-6 space-y-2 text-white/80 light:text-gray-700">
            <li>Точный адрес, корпус, этаж, номер комнаты/аудитории.</li>
            <li>Фото или короткое видео проблемы.</li>
            <li>Дата и время обнаружения.</li>
            <li>Краткое описание: что не работает и как это влияет на учебу/проживание.</li>
            <li>Контакт для обратной связи.</li>
          </ol>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Пошаговый маршрут</h2>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200">
              <p className="font-semibold light:text-gray-900">Шаг 1. Локальная фиксация</p>
              <p className="mt-1 text-white/75 light:text-gray-700">
                Сообщите проблему ответственному на месте (комендант, дежурный, администратор
                корпуса) и зафиксируйте, кому и когда передали информацию.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200">
              <p className="font-semibold light:text-gray-900">Шаг 2. Передача в ОСС</p>
              <p className="mt-1 text-white/75 light:text-gray-700">
                Отправьте структурированное описание проблемы в каналы ОСС (контакты и Telegram),
                приложив материалы и факт первичного обращения.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200">
              <p className="font-semibold light:text-gray-900">Шаг 3. Контроль статуса</p>
              <p className="mt-1 text-white/75 light:text-gray-700">
                Уточняйте статус по согласованному интервалу. Если срок превышен, запускайте
                эскалацию по расширенному гайду.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/guides/infrastructure-deepdive"
            className="rounded-xl bg-oss-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-oss-red/90 transition"
          >
            Открыть расширенный гайд
          </Link>
          <Link
            href="/content"
            className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-800 light:border-gray-300 light:hover:bg-gray-100"
          >
            Вернуться к контенту
          </Link>
        </div>
      </article>
    </main>
  );
}

