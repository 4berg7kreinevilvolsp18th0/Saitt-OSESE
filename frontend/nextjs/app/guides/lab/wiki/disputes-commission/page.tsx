import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const DisputesCommissionGuideExperience = dynamic(
  () => import('../../../../../components/guides/content/DisputesCommissionGuideExperience'),
  { ssr: true }
);

export const metadata: Metadata = {
  title: 'Лаборатория · Wiki · Комиссия по спорам | ОСС ДВФУ',
  description: 'Демо-оболочка Wiki/Confluence на каноническом тексте гайда.',
};

export default function LabWikiDisputesCommissionPage() {
  return <DisputesCommissionGuideExperience mode="lab" />;
}
