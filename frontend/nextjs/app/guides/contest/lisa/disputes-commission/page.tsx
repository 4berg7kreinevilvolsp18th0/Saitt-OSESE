import type { Metadata } from 'next';
import {
  DISPUTES_COMMISSION_COPY,
  DISPUTES_COMMISSION_TOC,
  DisputesCommissionGuideBody,
} from '../../../../../components/guides/content/DisputesCommissionGuideBody';
import GuideSkinLisa, { LisaCallout, LisaSection } from '../../../../../components/guides/contest/GuideSkinLisa';

export const metadata: Metadata = {
  title: 'Комиссия по спорам (конкурс · Лиза) | ОСС ДВФУ',
  description:
    'Гайд о том, что такое Комиссия по спорам и по каким причинам стоит туда обращаться. Демо-оформление Younote.',
  openGraph: {
    title: 'Комиссия по спорам — дизайн Лиза',
    description: 'Конкурс дизайнов гайдов ОСС, макет в стиле Younote.',
    type: 'article',
  },
};

export default function LisaDisputesCommissionPage() {
  return (
    <GuideSkinLisa
      title={DISPUTES_COMMISSION_COPY.title}
      subtitle={DISPUTES_COMMISSION_COPY.subtitle}
      badge="Правовой комитет · демо для жюри"
      metaLine="Актуально для конкурса дизайнов · Материал ОСС ДВФУ (2024)"
      tocItems={[...DISPUTES_COMMISSION_TOC]}
      showReferenceStrip
    >
      <DisputesCommissionGuideBody Section={LisaSection} Callout={LisaCallout} />
      <p className="mt-8 text-sm text-[#9b9a97] dark:text-neutral-500 pt-4 border-t border-[#e9e9e7] dark:border-white/10">
        Дизайн-концепт: Лиза, референс Younote. Текст совпадает с лабораторией концептов для честного
        сравнения.
      </p>
    </GuideSkinLisa>
  );
}
