import Link from 'next/link';

export default function ConflictCommissionGuidePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <article className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 light:bg-white light:border-gray-200 light:shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-oss-red/40 bg-oss-red/10 px-3 py-1 text-xs font-semibold text-oss-red">
            Правовой комитет
          </span>
          <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 light:text-emerald-700 light:border-emerald-200 light:bg-emerald-50">
            Гайд
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold light:text-gray-900">
          Конфликтная комиссия: как устроена и что делать, если вас вызвали
        </h1>
        <p className="mt-3 text-white/70 light:text-gray-600">
          Практический материал о том, что такое Конфликтная комиссия, как проходит заседание и
          как подготовиться заранее.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Содержание</h2>
          <ul className="mt-3 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>Что такое Конфликтная комиссия</li>
            <li>Основания</li>
            <li>Рапорт и беседа</li>
            <li>Если вызвали на Комиссию</li>
            <li>Как проходит заседание</li>
            <li>Меры взыскания</li>
            <li>Последствия</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Что такое Конфликтная комиссия</h2>
          <p className="mt-3 text-white/80 light:text-gray-700">
            Конфликтная комиссия — орган, который рассматривает нарушения студентами
            внутриуниверситетских правил.
          </p>
          <p className="mt-3 text-white/80 light:text-gray-700">Состав комиссии:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>председатель;</li>
            <li>заместитель председателя;</li>
            <li>секретарь;</li>
            <li>2 представителя от студенчества (избираются ОСС).</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Основания</h2>
          <p className="mt-3 text-white/80 light:text-gray-700">
            Основные причины, по которым студент может попасть на Комиссию:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>распитие алкоголя или состояние опьянения в кампусе/общежитиях;</li>
            <li>курение табачной и никотиновой продукции (сигареты, вейпы, кальяны и т.д.);</li>
            <li>проникновение в гостиницу в обход охраны или по поддельному пропуску;</li>
            <li>предпринимательская деятельность и распространение рекламы на территории ДВФУ;</li>
            <li>небрежное отношение к имуществу ДВФУ.</li>
          </ul>
          <p className="mt-3 text-white/80 light:text-gray-700">Нормативная база:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>Правила внутреннего распорядка ДВФУ;</li>
            <li>Правила размещения обучающихся и сотрудников в гостиничном комплексе кампуса;</li>
            <li>Правила проживания в городских общежитиях ДВФУ.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Рапорт и беседа</h2>
          <h3 className="mt-4 text-lg font-semibold light:text-gray-900">Охранник</h3>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>
              При составлении рапорта студент должен ознакомиться с описанием ситуации в верхней
              части документа.
            </li>
            <li>После этого можно заполнить объяснение в нижней части.</li>
            <li>
              Если верхняя часть не предоставляется для ознакомления, вы вправе отказаться от
              объяснений и подписи.
            </li>
          </ul>
          <p className="mt-3 text-white/80 light:text-gray-700">
            Если считаете действия охранника предвзятыми, можно обратиться в Департамент
            комплексной безопасности:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>Телефон: 8 (423) 265-24-24</li>
            <li>Email: dkb@dvfu.ru</li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold light:text-gray-900">
            Председатель Конфликтной комиссии
          </h3>
          <p className="mt-2 text-white/80 light:text-gray-700">
            После профилактической беседы в ДМП материалы передаются председателю. Он принимает
            решение, выносить ли случай на Комиссию, учитывая рапорт, тяжесть и повторяемость
            нарушения, а также факты, установленные в ходе беседы.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Если вызвали на Комиссию</h2>
          <h3 className="mt-4 text-lg font-semibold light:text-gray-900">Уведомление о заседании</h3>
          <p className="mt-2 text-white/80 light:text-gray-700">
            Материалы рассматриваются до 7 рабочих дней. За 3 рабочих дня секретарь уведомляет о
            дате, времени и месте заседания по корпоративной почте.
          </p>
          <p className="mt-2 text-white/80 light:text-gray-700">
            Администрация школы также получает уведомление и может подготовить характеристику
            студента.
          </p>

          <h3 className="mt-6 text-lg font-semibold light:text-gray-900">
            Что можно сделать до заседания
          </h3>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>Обратиться в Объединенный совет студентов за сопровождением.</li>
            <li>
              Собрать характеристики: от старосты, заместителя РОПа, студенческих организаций и
              других ответственных лиц.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">
            Как проходит заседание Конфликтной комиссии
          </h2>
          <ul className="mt-3 list-disc pl-6 space-y-1 text-white/80 light:text-gray-700">
            <li>Вы можете высказать позицию по существу вопроса.</li>
            <li>Рекомендуется вести диалог спокойно, честно и уважительно.</li>
            <li>
              Неявка без уважительной причины не останавливает рассмотрение — решение может быть
              принято без студента.
            </li>
            <li>
              При уважительной причине необходимо заранее уведомить председателя, чтобы перенести
              заседание.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Меры взыскания</h2>
          <p className="mt-3 text-white/80 light:text-gray-700">
            Комиссия может рекомендовать предупреждение, дисциплинарное взыскание (замечание/выговор)
            или отчисление. За одно нарушение назначается одно дисциплинарное взыскание.
          </p>
          <p className="mt-2 text-white/80 light:text-gray-700">
            Решение об отчислении принимает школа. Если вы не согласны с решением, его можно
            обжаловать проректору по молодежной политике в течение 5 рабочих дней с момента
            извещения.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold light:text-gray-900">Последствия</h2>
          <p className="mt-3 text-white/80 light:text-gray-700">
            Решения Комиссии учитываются в дальнейшем: при конкурсах, стипендиальных программах,
            переводе на бюджет, поощрениях, распределении мест в общежитиях и формировании
            характеристик.
          </p>
        </section>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 light:bg-gray-50 light:border-gray-200 light:text-gray-700">
          По вопросам можно обратиться в Объединенный совет студентов или в Студенческий офис:
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
            href="/contacts"
            className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-800 light:border-gray-300 light:hover:bg-gray-100"
          >
            Контакты ОСС
          </Link>
        </div>
      </article>
    </main>
  );
}

