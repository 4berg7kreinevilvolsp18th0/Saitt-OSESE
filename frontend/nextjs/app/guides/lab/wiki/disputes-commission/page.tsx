import type { Metadata } from 'next';
import {
  DISPUTES_COMMISSION_COPY,
  DISPUTES_COMMISSION_TOC,
  DisputesCommissionGuideBody,
} from '../../../../../components/guides/content/DisputesCommissionGuideBody';
import GuideSkinLabWiki, { WikiCallout, WikiSection } from '../../../../../components/guides/lab/GuideSkinLabWiki';

export const metadata: Metadata = {
  title: 'Лаборатория · Wiki · Комиссия по спорам | ОСС ДВФУ',
  description: 'Демо-оболочка Wiki/Confluence на каноническом тексте гайда.',
};

export default function LabWikiDisputesCommissionPage() {
  return (
    <GuideSkinLabWiki
      conceptSlug="wiki"
      conceptLabel="Wiki / Confluence"
      title={DISPUTES_COMMISSION_COPY.title}
      subtitle={DISPUTES_COMMISSION_COPY.subtitle}
      badge="Лаборатория · черновик"
      metaLine={DISPUTES_COMMISSION_COPY.metaLine}
      tocItems={DISPUTES_COMMISSION_TOC}
    >
      <DisputesCommissionGuideBody Section={WikiSection} Callout={WikiCallout} />
    </GuideSkinLabWiki>
  );
}
