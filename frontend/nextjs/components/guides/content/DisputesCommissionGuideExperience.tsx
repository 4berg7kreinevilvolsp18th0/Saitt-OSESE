'use client';

import { useMemo } from 'react';
import GuideSkinLisa, { LisaCallout, LisaSection } from '../contest/GuideSkinLisa';
import GuideSkinLabWiki, { WikiCallout, WikiSection } from '../lab/GuideSkinLabWiki';
import GuideSkinLabMedium, { MediumCallout, MediumSection } from '../lab/GuideSkinLabMedium';
import GuideSkinLabTimeline, { TimelineCallout, TimelineSection } from '../lab/GuideSkinLabTimeline';
import GuideSkinLabFaq, { FaqCallout, FaqSection } from '../lab/GuideSkinLabFaq';
import {
  DISPUTES_COMMISSION_COPY,
  DISPUTES_COMMISSION_TOC,
  DisputesCommissionGuideBody,
} from './DisputesCommissionGuideBody';
import { getStoredGuideSkin, resolveSkin, type GuideSkinId } from '../../../lib/guideSkins';

type Props = {
  mode: 'lab' | 'contest';
};

const allowedSkins: readonly GuideSkinId[] = ['lisa', 'wiki', 'medium', 'timeline', 'faq'];

export default function DisputesCommissionGuideExperience({ mode }: Props) {
  const querySkin = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('skin') : null;
  const currentSkin = useMemo(
    () =>
      resolveSkin({
        querySkin,
        storedSkin: getStoredGuideSkin(),
        allowedSkins,
        fallback: 'lisa',
      }),
    [querySkin]
  );

  if (currentSkin === 'wiki') {
    return (
      <GuideSkinLabWiki
        conceptSlug="wiki"
        conceptLabel={mode === 'contest' ? 'Конкурс · Wiki demo' : 'Wiki / Confluence'}
        title={DISPUTES_COMMISSION_COPY.title}
        subtitle={DISPUTES_COMMISSION_COPY.subtitle}
        badge={mode === 'contest' ? 'Конкурс · skin demo' : 'Лаборатория · черновик'}
        metaLine={DISPUTES_COMMISSION_COPY.metaLine}
        tocItems={DISPUTES_COMMISSION_TOC}
      >
        <DisputesCommissionGuideBody Section={WikiSection} Callout={WikiCallout} />
      </GuideSkinLabWiki>
    );
  }

  if (currentSkin === 'medium') {
    return (
      <GuideSkinLabMedium
        conceptLabel={mode === 'contest' ? 'Конкурс · Medium demo' : 'Medium-лонгрид'}
        title={DISPUTES_COMMISSION_COPY.title}
        subtitle={DISPUTES_COMMISSION_COPY.subtitle}
        badge={mode === 'contest' ? 'Конкурс · skin demo' : 'Лаборатория · черновик'}
        metaLine={DISPUTES_COMMISSION_COPY.metaLine}
      >
        <DisputesCommissionGuideBody Section={MediumSection} Callout={MediumCallout} />
      </GuideSkinLabMedium>
    );
  }

  if (currentSkin === 'timeline') {
    return (
      <GuideSkinLabTimeline
        conceptLabel={mode === 'contest' ? 'Конкурс · Timeline demo' : 'Таймлайн'}
        title={DISPUTES_COMMISSION_COPY.title}
        subtitle={DISPUTES_COMMISSION_COPY.subtitle}
        badge={mode === 'contest' ? 'Конкурс · skin demo' : 'Лаборатория · черновик'}
        metaLine={DISPUTES_COMMISSION_COPY.metaLine}
      >
        <DisputesCommissionGuideBody Section={TimelineSection} Callout={TimelineCallout} />
      </GuideSkinLabTimeline>
    );
  }

  if (currentSkin === 'faq') {
    return (
      <GuideSkinLabFaq
        conceptLabel={mode === 'contest' ? 'Конкурс · FAQ demo' : 'FAQ-first'}
        title={DISPUTES_COMMISSION_COPY.title}
        subtitle={DISPUTES_COMMISSION_COPY.subtitle}
        badge={mode === 'contest' ? 'Конкурс · skin demo' : 'Лаборатория · черновик'}
        metaLine={DISPUTES_COMMISSION_COPY.metaLine}
      >
        <DisputesCommissionGuideBody Section={FaqSection} Callout={FaqCallout} />
      </GuideSkinLabFaq>
    );
  }

  return (
    <GuideSkinLisa
      title={DISPUTES_COMMISSION_COPY.title}
      subtitle={DISPUTES_COMMISSION_COPY.subtitle}
      badge={mode === 'contest' ? 'Правовой комитет · демо для жюри' : 'Лаборатория · Lisa / Younote'}
      metaLine={
        mode === 'contest'
          ? 'Актуально для конкурса дизайнов · Материал ОСС ДВФУ (2024)'
          : DISPUTES_COMMISSION_COPY.metaLine
      }
      tocItems={[...DISPUTES_COMMISSION_TOC]}
      showReferenceStrip={mode === 'contest'}
    >
      <DisputesCommissionGuideBody Section={LisaSection} Callout={LisaCallout} />
    </GuideSkinLisa>
  );
}
