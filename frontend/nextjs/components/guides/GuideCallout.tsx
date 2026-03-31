import { ReactNode } from 'react';

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

export default function GuideCallout({
  variant,
  children,
}: {
  variant: Variant;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-4 ${variantStyles[variant]}`}>
      <p className="text-sm font-semibold light:text-gray-900">{variantTitle[variant]}</p>
      <div className="mt-1 text-sm text-white/80 light:text-gray-700">{children}</div>
    </div>
  );
}

