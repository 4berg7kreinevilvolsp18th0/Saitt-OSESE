import { ColorKey, committeeColorKey } from './theme';

export type GuideLevel = 'basic' | 'deepdive';
export type GuideStatus = 'draft' | 'published';

export type GuideMeta = {
  title: string;
  slug: string;
  committee: string;
  level: GuideLevel;
  updatedAt: string;
  status: GuideStatus;
  tags: string[];
  description: string;
  colorKey: ColorKey;
};

export const GUIDES_REGISTRY: GuideMeta[] = [
  {
    title: 'Инфраструктура: базовый алгоритм действий',
    slug: 'infrastructure',
    committee: 'Инфраструктурный блок',
    level: 'basic',
    updatedAt: '2026-03-11',
    status: 'published',
    tags: ['инфраструктура', 'общежитие', 'кампус'],
    description: 'Базовый маршрут действий: фиксация, обращение, контроль статуса.',
    colorKey: committeeColorKey('Инфраструктурный блок'),
  },
  {
    title: 'Инфраструктура: эскалация, сроки и шаблоны',
    slug: 'infrastructure-deepdive',
    committee: 'Инфраструктурный блок',
    level: 'deepdive',
    updatedAt: '2026-03-11',
    status: 'published',
    tags: ['инфраструктура', 'эскалация', 'сроки'],
    description: 'Расширенный сценарий: уровни эскалации, сроки и шаблоны формулировок.',
    colorKey: committeeColorKey('Инфраструктурный блок'),
  },
  {
    title: 'Конфликтная комиссия: как устроена и что делать',
    slug: 'conflict-commission',
    committee: 'Правовой комитет',
    level: 'deepdive',
    updatedAt: '2026-03-11',
    status: 'published',
    tags: ['правовой комитет', 'конфликтная комиссия', 'дисциплина'],
    description: 'Порядок работы комиссии, подготовка к заседанию и последствия.',
    colorKey: committeeColorKey('Правовой комитет'),
  },
  {
    title: 'Медицинское обслуживание: поликлиника и прикрепление',
    slug: 'medical-service',
    committee: 'Инфраструктурный блок',
    level: 'basic',
    updatedAt: '2026-03-11',
    status: 'published',
    tags: ['медицина', 'омс', 'кампус'],
    description: 'Как прикрепиться к поликлинике и где получить помощь на острове.',
    colorKey: committeeColorKey('Инфраструктурный блок'),
  },
  {
    title: 'Showcase: витрина элементов гайда',
    slug: 'showcase',
    committee: 'ОСС',
    level: 'deepdive',
    updatedAt: '2026-03-11',
    status: 'published',
    tags: ['showcase', 'шаблон', 'дизайн'],
    description: 'Демо-страница со всеми UI-элементами для будущих гайдов.',
    colorKey: committeeColorKey('ОСС'),
  },
];

export function getGuideBySlug(slug: string): GuideMeta | undefined {
  return GUIDES_REGISTRY.find((guide) => guide.slug === slug);
}

export function getPublishedGuides(): GuideMeta[] {
  return GUIDES_REGISTRY.filter((guide) => guide.status === 'published');
}

