import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const DisputesCommissionGuideExperience = dynamic(
  () => import('../../../../../components/guides/content/DisputesCommissionGuideExperience'),
  { ssr: true }
);

export const metadata: Metadata = {
  title: 'Комиссия по спорам (конкурс · Лиза) | ОСС ДВФУ',
  description:
    'Гайд о том, что такое Комиссия по спорам и по каким причинам стоит туда обращаться. Демо-оформление Younote.',
  openGraph: {
    title: 'Комиссия по спорам — дизайн Лиза',
    description: 'Конкурс дизайнов гайдов ОСС, макет в стиле Younote.',
    type: 'article',
  },
};

export default function LisaDisputesCommissionPage() {
  return <DisputesCommissionGuideExperience mode="contest" />;
}
