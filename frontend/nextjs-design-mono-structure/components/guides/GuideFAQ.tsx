'use client';

import { trackGuideEvent } from '../../lib/guideAnalytics';

type FaqItem = { q: string; a: string };

export default function GuideFAQ({ items, slug }: { items: FaqItem[]; slug: string }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-xl border border-white/10 bg-white/5 p-4 open:bg-white/10 light:bg-gray-50 light:border-gray-200 light:open:bg-gray-100"
          onToggle={(e) =>
            trackGuideEvent('guide_faq_toggle', {
              slug,
              question: item.q,
              open: (e.currentTarget as HTMLDetailsElement).open,
            })
          }
        >
          <summary className="cursor-pointer list-none font-semibold text-white light:text-gray-900">
            {item.q}
          </summary>
          <p className="mt-2 text-sm text-white/75 light:text-gray-700">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

