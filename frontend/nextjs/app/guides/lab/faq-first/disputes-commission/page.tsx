import type { Metadata } from 'next';
import {
  DISPUTES_COMMISSION_COPY,
  DisputesCommissionGuideBody,
} from '../../../../../components/guides/content/DisputesCommissionGuideBody';
import GuideSkinLabFaq, { FaqCallout, FaqSection } from '../../../../../components/guides/lab/GuideSkinLabFaq';

export const metadata: Metadata = {
  title: 'Лаборатория · FAQ-first · Комиссия по спорам | ОСС ДВФУ',
  description: 'Демо-оболочка FAQ-first на каноническом тексте гайда.',
};

export default function LabFaqFirstDisputesCommissionPage() {
  return (
    <GuideSkinLabFaq
      conceptLabel="FAQ-first"
      title={DISPUTES_COMMISSION_COPY.title}
      subtitle={DISPUTES_COMMISSION_COPY.subtitle}
      badge="Лаборатория · черновик"
      metaLine={DISPUTES_COMMISSION_COPY.metaLine}
    >
      <DisputesCommissionGuideBody Section={FaqSection} Callout={FaqCallout} />
    </GuideSkinLabFaq>
  );
}
