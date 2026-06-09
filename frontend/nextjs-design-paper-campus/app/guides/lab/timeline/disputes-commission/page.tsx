import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const DisputesCommissionGuideExperience = dynamic(
  () => import('../../../../../components/guides/content/DisputesCommissionGuideExperience'),
  { ssr: true }
);

export const metadata: Metadata = {
  title: 'Лаборатория · Таймлайн · Комиссия по спорам | ОСС ДВФУ',
  description: 'Демо-оболочка таймлайна на каноническом тексте гайда.',
};

export default function LabTimelineDisputesCommissionPage() {
  return <DisputesCommissionGuideExperience mode="lab" />;
}
