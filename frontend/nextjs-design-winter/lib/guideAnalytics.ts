export type GuideEventName =
  | 'guide_scroll_depth'
  | 'guide_cta_click'
  | 'guide_faq_toggle'
  | 'guide_share_copy'
  | 'guide_share_click';

type GuideEventPayload = Record<string, string | number | boolean>;

export function trackGuideEvent(event: GuideEventName, payload: GuideEventPayload = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  const detail = {
    event,
    payload,
    ts: Date.now(),
  };

  window.dispatchEvent(new CustomEvent('oss:guide-analytics', { detail }));

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info('[guide-analytics]', detail);
  }
}

