import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GuideRenderer from '../../../../components/guides/GuideRenderer';
import { getMdxGuideBySlug, getMdxGuideSlugs } from '../../../../lib/guidesMdx';

export const revalidate = 300;

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getMdxGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getMdxGuideBySlug(params.slug);
  if (!guide) return {};

  return {
    title: `${guide.meta.title} | ОСС ДВФУ`,
    description: guide.meta.description,
    openGraph: {
      title: guide.meta.title,
      description: guide.meta.description,
      type: 'article',
    },
  };
}

export default function MdxGuidePage({ params }: Props) {
  const guide = getMdxGuideBySlug(params.slug);
  if (!guide) {
    notFound();
  }

  return <GuideRenderer meta={guide.meta} markdown={guide.markdown} />;
}
