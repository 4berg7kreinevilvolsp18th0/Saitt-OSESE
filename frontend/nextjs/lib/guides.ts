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
  },
];

export function getGuideBySlug(slug: string): GuideMeta | undefined {
  return GUIDES_REGISTRY.find((guide) => guide.slug === slug);
}

export function getPublishedGuides(): GuideMeta[] {
  return GUIDES_REGISTRY.filter((guide) => guide.status === 'published');
}

