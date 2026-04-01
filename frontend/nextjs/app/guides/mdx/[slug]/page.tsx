import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GuideRenderer from '../../../../components/guides/GuideRenderer';
import { getMdxGuideBySlug, getMdxGuideSlugs } from '../../../../lib/guidesMdx';

export const revalidate = 300;
