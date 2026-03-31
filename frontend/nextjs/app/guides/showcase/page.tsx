import type { Metadata } from 'next';
import GuideLayout from '../../../components/guides/GuideLayout';
import GuideSection from '../../../components/guides/GuideSection';
import GuideCallout from '../../../components/guides/GuideCallout';
import GuideTable from '../../../components/guides/GuideTable';
import GuideChecklist from '../../../components/guides/GuideChecklist';
import GuideFAQ from '../../../components/guides/GuideFAQ';
import GuideCTA from '../../../components/guides/GuideCTA';
import { getGuideBySlug } from '../../../lib/guides';

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

const meta = getGuideBySlug('showcase')!;

export const metadata: Metadata = {
  title: `${meta.title} | ОСС ДВФУ`,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: 'article',
  },
};

export default function ShowcaseGuidePage() {
  return (
    <GuideLayout
      meta={meta}
      badges={['Тестовый гайд', 'Showcase']}
      summary="Демонстрационный материал для проверки визуального языка портала: пометки, инфоблоки, таблицы, выноски, таймлайн, чеклисты и FAQ."
      tocItems={[
        { id: 'kpi', title: 'Инфографика KPI' },
        { id: 'timeline', title: 'Таймлайн' },
        { id: 'table', title: 'Таблица решений' },
        { id: 'checklist', title: 'Чеклисты и пометки' },
        { id: 'faq', title: 'FAQ' },
      ]}
    >
      <GuideSection id="kpi" title="Инфографика KPI">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
        </div>
        <div className="mt-4">
          <GuideCallout variant="important">
            Этот гайд — тестовый шаблон для визуальной оценки. Контент можно адаптировать под любой
            комитет без изменения структуры страницы.
          </GuideCallout>
        </div>
      </GuideSection>

      <GuideSection id="timeline" title="Таймлайн работы с кейсом">
        <div className="space-y-3">
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
      </GuideSection>

      <GuideSection id="table" title="Таблица: симптом → действие → канал">
        <GuideTable
          headers={['Симптом', 'Действие', 'Канал']}
          rows={[
            ['Срочная инфраструктурная поломка', 'Фиксация + немедленное уведомление', 'Контакты ОСС + Telegram'],
            ['Нет обратной связи', 'Эскалация с хронологией', 'Профильный комитет'],
            ['Нужны документы/шаблон', 'Взять шаблон обращения', 'Раздел «Контент»'],
          ]}
        />
      </GuideSection>

      <GuideSection id="checklist" title="Чеклисты и пометки">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GuideChecklist
            title="Чеклист перед отправкой"
            items={[
              'Описание проблемы в 2-3 предложениях',
              'Фото/скрин/видео при наличии',
              'Место, дата, время',
              'Контакт для обратной связи',
            ]}
          />
          <GuideCallout variant="tip">
            Пишите нейтрально и по фактам: меньше эмоций, больше конкретики и хронологии.
          </GuideCallout>
        </div>
      </GuideSection>

      <GuideSection id="faq" title="FAQ">
        <GuideFAQ items={faq} slug={meta.slug} />
      </GuideSection>

      <blockquote className="mt-8 rounded-xl border-l-4 border-oss-red bg-white/5 p-4 italic text-white/80 light:bg-gray-50 light:text-gray-700">
        «Хороший гайд не только объясняет, что делать, но и снижает тревожность за счет прозрачного
        маршрута действий».
      </blockquote>

      <GuideCTA
        slug={meta.slug}
        links={[
          { href: '/content', label: 'Перейти в раздел контента', primary: true },
          { href: '/guides/infrastructure-deepdive', label: 'Сравнить с инфра-гайдом' },
        ]}
      />
    </GuideLayout>
  );
}

