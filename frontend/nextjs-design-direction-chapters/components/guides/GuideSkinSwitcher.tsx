'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { GUIDE_SKIN_LABELS, GUIDE_SKINS, type GuideSkinId, setStoredGuideSkin } from '../../lib/guideSkins';

type Props = {
  allowedSkins?: readonly GuideSkinId[];
  currentSkin: GuideSkinId;
  className?: string;
};

export default function GuideSkinSwitcher({ allowedSkins, currentSkin, className = '' }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const skins = useMemo(
    () => (allowedSkins?.length ? [...allowedSkins] : [...GUIDE_SKINS]),
    [allowedSkins]
  );

  const onChange = (nextSkin: GuideSkinId) => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    params.set('skin', nextSkin);
    setStoredGuideSkin(nextSkin);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <label className={`inline-flex items-center gap-2 text-xs ${className}`}>
      <span className="opacity-75">Дизайн:</span>
      <select
        value={currentSkin}
        onChange={(event) => onChange(event.target.value as GuideSkinId)}
        className="rounded-md border border-white/20 bg-black/20 px-2 py-1 text-xs light:border-gray-300 light:bg-white"
        aria-label="Выбор дизайна гайда"
      >
        {skins.map((skin) => (
          <option key={skin} value={skin}>
            {GUIDE_SKIN_LABELS[skin]}
          </option>
        ))}
      </select>
    </label>
  );
}
