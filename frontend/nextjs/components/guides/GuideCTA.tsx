'use client';

import Link from 'next/link';
import { trackGuideEvent } from '../../lib/guideAnalytics';

type CtaLink = {
  href: string;
  label: string;
  primary?: boolean;
};

export default function GuideCTA({ slug, links }: { slug: string; links: CtaLink[] }) {
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      {links.map((link) => (
        <Link
          key={link.href + link.label}
          href={link.href}
          onClick={() => trackGuideEvent('guide_cta_click', { slug, href: link.href })}
          className={
            link.primary
              ? 'rounded-xl bg-oss-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-oss-red/90 transition'
              : 'rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-800 light:border-gray-300 light:hover:bg-gray-100'
          }
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

