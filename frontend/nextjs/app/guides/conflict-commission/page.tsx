import type { Metadata } from 'next';
import GuideLayout from '../../../components/guides/GuideLayout';
import GuideSection from '../../../components/guides/GuideSection';
import GuideCallout from '../../../components/guides/GuideCallout';
import GuideCTA from '../../../components/guides/GuideCTA';
import { getGuideBySlug } from '../../../lib/guides';

const meta = getGuideBySlug('conflict-commission')!;

export const metadata: Metadata = {
  title: `${meta.title} | ОСС ДВФУ`,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: 'article',
  },
};

export default function ConflictCommissionGuidePage() {
  return (
    <GuideLayout
      meta={meta}
      badges={['Правовой комитет', 'Гайд']}
      summary="Практический материал о том, что такое Конфликтная комиссия, как проходит заседание и как подготовиться заранее."
      tocItems={[
        { id: 'about', title: 'Что такое комиссия' },
        { id: 'grounds', title: 'Основания' },
        { id: 'report', title: 'Рапорт и беседа' },
        { id: 'summon', title: 'Если вызвали на комиссию' },
        { id: 'hearing', title: 'Как проходит заседание' },
        { id: 'measures', title: 'Меры взыскания' },
        { id: 'effects', title: 'Последствия' },
      ]}
    >
      <GuideSection id="about" title="Что такое Конфликтная комиссия">
        <p>Конфликтная комиссия рассматривает нарушения студентами внутриуниверситетских правил.</p>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>председатель, заместитель и секретарь;</li>
          <li>2 представителя от студенчества (избираются ОСС).</li>
        </ul>
      </GuideSection>

      <GuideSection id="grounds" title="Основания">
        <ul className="list-disc pl-6 space-y-1">
          <li>распитие алкоголя/состояние опьянения;</li>
          <li>курение табачной и никотиновой продукции;</li>
          <li>проникновение в обход охраны или по поддельному пропуску;</li>
          <li>предпринимательская деятельность и реклама на территории ДВФУ;</li>
          <li>небрежное отношение к имуществу ДВФУ.</li>
        </ul>
        <GuideCallout variant="policy" colorKey={meta.colorKey}>
          Нормативная база: Правила внутреннего распорядка ДВФУ, правила размещения в кампусе и
          правила проживания в городских общежитиях.
        </GuideCallout>
      </GuideSection>

      <GuideSection id="report" title="Рапорт и беседа">
        <GuideCallout variant="important" colorKey={meta.colorKey}>
          При составлении рапорта студент должен ознакомиться с верхней частью документа. Если
          документ не дают прочитать, можно отказаться от объяснений и подписи.
        </GuideCallout>
        <p className="mt-3">
          При подозрении на предвзятость можно обратиться в Департамент комплексной безопасности:
          8 (423) 265-24-24, dkb@dvfu.ru.
        </p>
      </GuideSection>

      <GuideSection id="summon" title="Если вызвали на комиссию">
        <p>
          Материалы рассматриваются до 7 рабочих дней. За 3 рабочих дня приходит уведомление по
          корпоративной почте.
        </p>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>обратитесь в ОСС за сопровождением;</li>
          <li>подготовьте характеристики от старосты/РОП/организаций.</li>
        </ul>
      </GuideSection>

      <GuideSection id="hearing" title="Как проходит заседание">
        <ul className="list-disc pl-6 space-y-1">
          <li>можно высказать позицию по существу вопроса;</li>
          <li>важно вести диалог спокойно и по фактам;</li>
          <li>неявка без уважительной причины не останавливает рассмотрение.</li>
        </ul>
      </GuideSection>

      <GuideSection id="measures" title="Меры взыскания">
        <p>
          Комиссия может рекомендовать предупреждение, дисциплинарное взыскание
          (замечание/выговор) или отчисление.
        </p>
        <GuideCallout variant="risk" colorKey={meta.colorKey}>
          Решение об отчислении принимает школа. Решение комиссии можно обжаловать проректору по
          молодежной политике в течение 5 рабочих дней.
        </GuideCallout>
      </GuideSection>

      <GuideSection id="effects" title="Последствия">
        <p>
          Решения комиссии учитываются в конкурсах, стипендиальных программах, переводе на бюджет и
          при предоставлении мест в общежитии.
        </p>
      </GuideSection>

      <GuideCTA
        slug={meta.slug}
        links={[
          { href: '/content', label: 'Перейти в раздел контента', primary: true },
          { href: '/contacts', label: 'Контакты ОСС' },
        ]}
      />
    </GuideLayout>
  );
}

