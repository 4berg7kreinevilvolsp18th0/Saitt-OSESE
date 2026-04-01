import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const DisputesCommissionGuideExperience = dynamic(
  () => import('../../../../../components/guides/content/DisputesCommissionGuideExperience'),
  { ssr: true }
);

export const metadata: Metadata = {
  title: 'Лаборатория · Medium · Комиссия по спорам | ОСС ДВФУ',
  description: 'Демо-оболочка лонгрида на каноническом тексте гайда.',
};

export default function LabMediumDisputesCommissionPage() {
  return <DisputesCommissionGuideExperience mode="lab" />;
}
