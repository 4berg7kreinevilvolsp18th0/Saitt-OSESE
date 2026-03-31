import type { Metadata } from 'next';
import {
  DISPUTES_COMMISSION_COPY,
  DisputesCommissionGuideBody,
} from '../../../../../components/guides/content/DisputesCommissionGuideBody';
import GuideSkinLabTimeline, {
  TimelineCallout,
  TimelineSection,
} from '../../../../../components/guides/lab/GuideSkinLabTimeline';

export const metadata: Metadata = {
  title: 'Лаборатория · Таймлайн · Комиссия по спорам | ОСС ДВФУ',
  description: 'Демо-оболочка таймлайна на каноническом тексте гайда.',
};

export default function LabTimelineDisputesCommissionPage() {
  return (
    <GuideSkinLabTimeline
      conceptLabel="Таймлайн"
      title={DISPUTES_COMMISSION_COPY.title}
      subtitle={DISPUTES_COMMISSION_COPY.subtitle}
      badge="Лаборатория · черновик"
      metaLine={DISPUTES_COMMISSION_COPY.metaLine}
    >
      <DisputesCommissionGuideBody Section={TimelineSection} Callout={TimelineCallout} />
    </GuideSkinLabTimeline>
  );
}
