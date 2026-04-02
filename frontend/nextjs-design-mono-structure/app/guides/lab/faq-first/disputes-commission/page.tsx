import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const DisputesCommissionGuideExperience = dynamic(
  () => import('../../../../../components/guides/content/DisputesCommissionGuideExperience'),
  { ssr: true }
);

export const metadata: Metadata = {
  title: 'Лаборатория · FAQ-first · Комиссия по спорам | ОСС ДВФУ',
  description: 'Демо-оболочка FAQ-first на каноническом тексте гайда.',
};

export default function LabFaqFirstDisputesCommissionPage() {
  return <DisputesCommissionGuideExperience mode="lab" />;
}
