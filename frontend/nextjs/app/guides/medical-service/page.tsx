import Link from 'next/link';

export default function MedicalServiceGuidePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <article className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 light:bg-white light:border-gray-200 light:shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 light:text-cyan-700 light:border-cyan-200 light:bg-cyan-50">
            Инфраструктура
          </span>
          <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 light:text-emerald-700 light:border-emerald-200 light:bg-emerald-50">
            Гайд
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold light:text-gray-900">
          Медицинское обслуживание: поликлиника и прикрепление
        </h1>
        <p className="mt-3 text-white/70 light:text-gray-600">
          Гайд по вопросам здоровья, прикреплению к поликлинике и медицинской помощи на кампусе.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Содержание</h2>
          <ul className="mt-3 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>Прикрепление к поликлинике</li>
            <li>Для чего это нужно</li>
            <li>Как прикрепиться к поликлинике</li>
            <li>Если вы на острове</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Для чего это нужно</h2>
          <p className="mt-3 text-white/80 light:text-gray-700">
            Если вы прикреплены к поликлинике, вы не платите деньги при обращении в рамках ОМС.
          </p>
          <p className="mt-3 text-white/80 light:text-gray-700">
            Медпомощь делится на категории:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>экстренная и неотложная помощь;</li>
            <li>платная помощь;</li>
            <li>бесплатная помощь по полису ОМС.</li>
          </ul>
          <p className="mt-3 text-white/80 light:text-gray-700">
            Если вы не из Владивостока, заранее позаботьтесь о смене полиса ОМС на владивостокский.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Как прикрепиться к поликлинике</h2>
          <p className="mt-3 text-white/80 light:text-gray-700">Возьмите с собой:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>паспорт или временное удостоверение личности;</li>
            <li>полис ОМС или его копию;</li>
            <li>копию паспорта.</li>
          </ul>
          <p className="mt-3 text-white/80 light:text-gray-700">
            Для обслуживания заполните заявление о прикреплении в регистратуре. Если его не
            заполняли заранее, форму выдадут на месте и помогут оформить.
          </p>
          <p className="mt-2 text-white/80 light:text-gray-700">
            В течение месяца приходит уведомление о принятии на медицинское обслуживание.
          </p>
          <p className="mt-2 text-white/80 light:text-gray-700">
            Поликлиника обязательно должна работать в системе ОМС.
          </p>
          <p className="mt-2 text-white/80 light:text-gray-700">
            Менять лечебное учреждение можно 1 раз в год. Исключение — переезд на новое место
            жительства (даже без регистрации).
          </p>
          <p className="mt-2 text-white/80 light:text-gray-700">
            Если через год не подтвердить прикрепление, система автоматически прикрепит вас к
            поликлинике по месту регистрации.
          </p>
          <p className="mt-2 text-white/80 light:text-gray-700">
            Без прикрепления обычно доступна только экстренная помощь в стационаре; плановые
            бесплатные услуги оказываются по месту прикрепления.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Если вы на острове</h2>
          <p className="mt-3 text-white/80 light:text-gray-700">
            На кампусе работает университетская поликлиника (часть медцентра ДВФУ) в корпусе 1.8.
          </p>
          <p className="mt-3 text-white/80 light:text-gray-700">В поликлинике принимают:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>терапевта;</li>
            <li>гинеколога;</li>
            <li>ЛОРа;</li>
            <li>окулиста;</li>
            <li>стоматолога;</li>
            <li>хирурга;</li>
            <li>невролога;</li>
            <li>психиатра.</li>
          </ul>
          <p className="mt-3 text-white/80 light:text-gray-700">
            Для первого обращения на кампусе прикрепляться не нужно: возьмите паспорт, полис и
            СНИЛС — вам заведут медкарту.
          </p>
          <p className="mt-2 text-white/80 light:text-gray-700">
            Университетская поликлиника оказывает помощь студентам и сотрудникам ДВФУ. Запись
            проводится на ближайшее свободное время.
          </p>
          <p className="mt-2 text-white/80 light:text-gray-700">
            Для симптомов ОРВИ в рабочие часы предусмотрен экстренный прием терапевта через
            отдельный вход.
          </p>
          <p className="mt-2 text-white/80 light:text-gray-700">
            При необходимости терапевт может выдать направление в Медицинский центр ДВФУ к узким
            специалистам, на УЗИ, рентген и анализы — по записи это бесплатно в рамках маршрута.
          </p>
        </section>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 light:bg-gray-50 light:border-gray-200 light:text-gray-700">
          По вопросам обращайтесь в Объединенный совет студентов или в Студенческий офис:
          8 (423) 265-24-24 (доб. 2164, 2118).
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/content"
            className="rounded-xl bg-oss-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-oss-red/90 transition"
          >
            Перейти в раздел контента
          </Link>
          <Link
            href="/guides/infrastructure"
            className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-800 light:border-gray-300 light:hover:bg-gray-100"
          >
            Другие гайды по инфраструктуре
          </Link>
        </div>
      </article>
    </main>
  );
}

