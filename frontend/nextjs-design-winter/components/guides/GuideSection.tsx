import { ReactNode } from 'react';

type GuideSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export default function GuideSection({ id, title, children }: GuideSectionProps) {
  return (
    <section id={id} className="scroll-mt-28 mt-8">
      <h2 className="text-xl font-semibold light:text-gray-900">{title}</h2>
      <div className="mt-3 text-white/80 light:text-gray-700">{children}</div>
    </section>
  );
}

