export type Direction = {
  slug: string;
  title: string;
  description: string;
  colorKey: 'legal' | 'infrastructure' | 'scholarship' | 'international' | 'neutral';
};

export const DIRECTIONS: Direction[] = [
  {
    slug: 'legal',
    title: 'Правовой комитет',
    description: 'Разъяснения, защита прав, апелляции, конфликты, регламенты.',
    colorKey: 'legal',
  },
  {
    slug: 'infrastructure',
    title: 'Инфраструктурный блок',
    description: 'Общежития, кампус, аудитории, быт и сервисы.',
    colorKey: 'infrastructure',
  },
  {
    slug: 'scholarship',
    title: 'Стипендиальный комитет',
    description: 'Стипендии, выплаты, сроки, причины удержаний, консультации.',
    colorKey: 'scholarship',
  },
  {
    slug: 'international',
    title: 'Иностранным студентам',
    description: 'Адаптация, коммуникация, академические и миграционные вопросы.',
    colorKey: 'international',
  },
  {
    slug: 'other',
    title: 'Другое / FAQ',
    description: 'Если не нашли подходящую категорию — мы поможем маршрутизировать.',
    colorKey: 'neutral',
  },
];
