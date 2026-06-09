'use client';

import { trackGuideEvent } from '../../lib/guideAnalytics';

export default function GuideShare({ slug, title }: { slug: string; title: string }) {
  const encodedUrl =
    typeof window !== 'undefined'
      ? encodeURIComponent(window.location.href)
      : encodeURIComponent(`https://oss.dvfu.ru/guides/${slug}`);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    if (typeof window === 'undefined') return;
    await navigator.clipboard.writeText(window.location.href);
    trackGuideEvent('guide_share_copy', { slug });
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 light:text-gray-700 light:border-gray-300 light:hover:bg-gray-100"
      >
        Копировать ссылку
      </button>
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackGuideEvent('guide_share_click', { slug, channel: 'telegram' })}
        className="rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 light:text-cyan-700"
      >
        Telegram
      </a>
      <a
        href={`https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackGuideEvent('guide_share_click', { slug, channel: 'vk' })}
        className="rounded-lg border border-sky-300/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200 light:text-sky-700"
      >
        VK
      </a>
    </div>
  );
}

