export const GUIDE_SKINS = ['lisa', 'wiki', 'medium', 'timeline', 'faq'] as const;

export type GuideSkinId = (typeof GUIDE_SKINS)[number];

export const DEFAULT_GUIDE_SKIN: GuideSkinId = 'lisa';

const GUIDE_SKIN_STORAGE_KEY = 'guideSkin';

export const GUIDE_SKIN_LABELS: Record<GuideSkinId, string> = {
  lisa: 'Lisa / Younote',
  wiki: 'Wiki',
  medium: 'Medium',
  timeline: 'Timeline',
  faq: 'FAQ-first',
};

export function isSupportedSkin(value: string | null | undefined): value is GuideSkinId {
  if (!value) return false;
  return (GUIDE_SKINS as readonly string[]).includes(value);
}

export function getStoredGuideSkin(): GuideSkinId | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(GUIDE_SKIN_STORAGE_KEY);
  return isSupportedSkin(stored) ? stored : null;
}

export function setStoredGuideSkin(skin: GuideSkinId) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUIDE_SKIN_STORAGE_KEY, skin);
}

export function resolveSkin({
  querySkin,
  storedSkin,
  allowedSkins,
  fallback = DEFAULT_GUIDE_SKIN,
}: {
  querySkin?: string | null;
  storedSkin?: string | null;
  allowedSkins?: readonly GuideSkinId[];
  fallback?: GuideSkinId;
}): GuideSkinId {
  const allowed = allowedSkins?.length ? allowedSkins : GUIDE_SKINS;
  const fallbackSkin = allowed.includes(fallback) ? fallback : allowed[0];

  if (querySkin && isSupportedSkin(querySkin) && allowed.includes(querySkin)) {
    return querySkin;
  }

  if (storedSkin && isSupportedSkin(storedSkin) && allowed.includes(storedSkin)) {
    return storedSkin;
  }

  return fallbackSkin;
}
