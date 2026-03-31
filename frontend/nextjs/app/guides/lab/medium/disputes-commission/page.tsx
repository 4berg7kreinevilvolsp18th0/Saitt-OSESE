import type { Metadata } from 'next';
import {
  DISPUTES_COMMISSION_COPY,
  DisputesCommissionGuideBody,
} from '../../../../../components/guides/content/DisputesCommissionGuideBody';
import GuideSkinLabMedium, { MediumCallout, MediumSection } from '../../../../../components/guides/lab/GuideSkinLabMedium';

export const metadata: Metadata = {
  title: 'Лаборатория · Medium · Комиссия по спорам | ОСС ДВФУ',
  description: 'Демо-оболочка лонгрида на каноническом тексте гайда.',
};

export default function LabMediumDisputesCommissionPage() {
  return (
    <GuideSkinLabMedium
      conceptLabel="Medium-лонгрид"
      title={DISPUTES_COMMISSION_COPY.title}
      subtitle={DISPUTES_COMMISSION_COPY.subtitle}
      badge="Лаборатория · черновик"
      metaLine={DISPUTES_COMMISSION_COPY.metaLine}
    >
      <DisputesCommissionGuideBody Section={MediumSection} Callout={MediumCallout} />
    </GuideSkinLabMedium>
  );
}
