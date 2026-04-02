import { ReactNode } from 'react';
import { ColorKey } from '../../lib/theme';

type Variant = 'important' | 'deadline' | 'risk' | 'tip' | 'policy';

const variantStyles: Record<Variant, string> = {
  important: 'border-amber-300/40 bg-amber-500/10 light:border-amber-200 light:bg-amber-50',
  deadline: 'border-cyan-300/40 bg-cyan-500/10 light:border-cyan-200 light:bg-cyan-50',
  risk: 'border-red-300/40 bg-red-500/10 light:border-red-200 light:bg-red-50',
  tip: 'border-emerald-300/40 bg-emerald-500/10 light:border-emerald-200 light:bg-emerald-50',
  policy: 'border-violet-300/40 bg-violet-500/10 light:border-violet-200 light:bg-violet-50',
};

const variantTitle: Record<Variant, string> = {
  important: 'Важно',
  deadline: 'Сроки',
  risk: 'Риск',
  tip: 'Совет',
  policy: 'Нормативная ссылка',
};

const committeeTints: Record<ColorKey, string> = {
  oss: 'border-oss-red/35 bg-oss-red/10',
  legal: 'border-legal/40 bg-legal/15',
  infrastructure: 'border-infrastructure/40 bg-infrastructure/15',
  scholarship: 'border-scholarship/40 bg-scholarship/15',
  international: 'border-international/45 bg-international/20',
  neutral: 'border-neutral/40 bg-neutral/15',
};

export default function GuideCallout({
  variant,
  children,
  colorKey,
}: {
  variant: Variant;
  children: ReactNode;
  colorKey?: ColorKey;
}) {
  const dynamicColor = colorKey && (variant === 'important' || variant === 'policy') ? committeeTints[colorKey] : '';
  return (
    <div className={`rounded-xl border p-4 ${dynamicColor || variantStyles[variant]}`}>
      <p className="text-sm font-semibold light:text-gray-900">{variantTitle[variant]}</p>
      <div className="mt-1 text-sm text-white/80 light:text-gray-700">{children}</div>
    </div>
  );
}

