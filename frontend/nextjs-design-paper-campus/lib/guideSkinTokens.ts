import type { GuideSkinId } from './guideSkins';

export type GuideSkinTokens = {
  pageBg: string;
  pageText: string;
  navText: string;
  navHover: string;
  surface: string;
  surfaceBorder: string;
  heading: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  calloutBg: string;
  calloutBorder: string;
  calloutTitle: string;
  chip: string;
};

const TOKENS: Record<GuideSkinId, GuideSkinTokens> = {
  lisa: {
    pageBg: 'bg-[#ebebea] dark:bg-[#191919]',
    pageText: 'text-[#37352f] dark:text-[#ececec]',
    navText: 'text-[#787774] dark:text-neutral-500',
    navHover: 'hover:text-[#37352f] dark:hover:text-neutral-200',
    surface: 'bg-white dark:bg-[#252525]',
    surfaceBorder: 'border-[#e3e2e0] dark:border-white/10',
    heading: 'text-[#37352f] dark:text-white',
    textPrimary: 'text-[#37352f]/90 dark:text-neutral-300',
    textSecondary: 'text-[#787774] dark:text-neutral-400',
    accent: 'text-[#9b9a97] dark:text-neutral-500',
    calloutBg: 'bg-[#f7f6f3] dark:bg-white/5',
    calloutBorder: 'border-[#e9e9e7] dark:border-white/10',
    calloutTitle: 'text-[#9b9a97] dark:text-neutral-500',
    chip: 'bg-[#f1f1ef] text-[#37352f] dark:bg-white/10 dark:text-neutral-200',
  },
  wiki: {
    pageBg: 'bg-slate-100 dark:bg-slate-950',
    pageText: 'text-slate-900 dark:text-slate-100',
    navText: 'text-slate-600 dark:text-slate-400',
    navHover: 'hover:text-sky-700 dark:hover:text-sky-300',
    surface: 'bg-white dark:bg-[#0f172a]',
    surfaceBorder: 'border-slate-200 dark:border-white/10',
    heading: 'text-slate-900 dark:text-white',
    textPrimary: 'text-slate-700 dark:text-slate-300',
    textSecondary: 'text-slate-600 dark:text-slate-400',
    accent: 'text-slate-500 dark:text-slate-500',
    calloutBg: 'bg-slate-50 dark:bg-white/5',
    calloutBorder: 'border-slate-200 dark:border-white/10',
    calloutTitle: 'text-slate-500 dark:text-slate-400',
    chip: 'bg-slate-50 text-slate-700 dark:bg-white/5 dark:text-slate-200',
  },
  medium: {
    pageBg: 'bg-[#fafaf9] dark:bg-neutral-950',
    pageText: 'text-neutral-900 dark:text-neutral-100',
    navText: 'text-neutral-500 dark:text-neutral-500',
    navHover: 'hover:text-neutral-800 dark:hover:text-neutral-200',
    surface: 'bg-transparent',
    surfaceBorder: 'border-transparent',
    heading: 'text-neutral-900 dark:text-white',
    textPrimary: 'text-neutral-700 dark:text-neutral-300',
    textSecondary: 'text-neutral-600 dark:text-neutral-400',
    accent: 'text-neutral-500 dark:text-neutral-500',
    calloutBg: 'bg-transparent',
    calloutBorder: 'border-neutral-300 dark:border-neutral-600',
    calloutTitle: 'text-neutral-500 dark:text-neutral-500',
    chip: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200',
  },
  timeline: {
    pageBg: 'bg-zinc-50 dark:bg-zinc-950',
    pageText: 'text-zinc-900 dark:text-zinc-100',
    navText: 'text-zinc-600 dark:text-zinc-400',
    navHover: 'hover:text-oss-red dark:hover:text-red-300',
    surface: 'bg-transparent',
    surfaceBorder: 'border-transparent',
    heading: 'text-zinc-900 dark:text-white',
    textPrimary: 'text-zinc-700 dark:text-zinc-300',
    textSecondary: 'text-zinc-600 dark:text-zinc-400',
    accent: 'text-zinc-500 dark:text-zinc-500',
    calloutBg: 'bg-zinc-100/80 dark:bg-white/5',
    calloutBorder: 'border-oss-red/80 dark:border-red-300',
    calloutTitle: 'text-oss-red dark:text-red-300',
    chip: 'bg-oss-red/10 text-oss-red dark:bg-red-950/50 dark:text-red-200',
  },
  faq: {
    pageBg: 'bg-white dark:bg-gray-950',
    pageText: 'text-gray-900 dark:text-gray-100',
    navText: 'text-gray-500 dark:text-gray-400',
    navHover: 'hover:text-oss-red dark:hover:text-red-300',
    surface: 'bg-transparent dark:bg-white/[0.02]',
    surfaceBorder: 'border-gray-200 dark:border-white/10',
    heading: 'text-gray-900 dark:text-white',
    textPrimary: 'text-gray-700 dark:text-gray-300',
    textSecondary: 'text-gray-600 dark:text-gray-400',
    accent: 'text-gray-500 dark:text-gray-500',
    calloutBg: 'bg-blue-50/90 dark:bg-blue-950/30',
    calloutBorder: 'border-blue-200 dark:border-blue-900/40',
    calloutTitle: 'text-blue-800 dark:text-blue-300',
    chip: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
  },
};

export function getGuideSkinTokens(skin: GuideSkinId): GuideSkinTokens {
  return TOKENS[skin];
}
