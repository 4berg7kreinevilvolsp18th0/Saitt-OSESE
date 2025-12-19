/**
 * Маппинг школ и институтов ДВФУ
 */

export interface School {
  code: string;
  name: string;
  fullName: string;
  shortName: string;
}

export const SCHOOLS: School[] = [
  {
    code: 'ИМО',
    name: 'ИМО',
    fullName: 'Институт Мирового Океана',
    shortName: 'ИМО',
  },
  {
    code: 'ПИ',
    name: 'ПИ',
    fullName: 'Политехнический Институт',
    shortName: 'ПИ',
  },
  {
    code: 'ПИШ',
    name: 'ПИШ',
    fullName: 'Передовая Инженерная Школа «Институт Биотехнологий, Биоинженерии и Пищевых Систем»',
    shortName: 'ПИШ',
  },
  {
    code: 'ЮШ',
    name: 'ЮШ',
    fullName: 'Юридическая Школа',
    shortName: 'ЮШ',
  },
  {
    code: 'Шминж',
    name: 'Шминж',
    fullName: 'Школа Медицины и Наук о Жизни',
    shortName: 'Шминж',
  },
  {
    code: 'ИФКИС',
    name: 'ИФКИС',
    fullName: 'Институт Физической Культуры и Спорта',
    shortName: 'ИФКИС',
  },
  {
    code: 'ИМКТ',
    name: 'ИМКТ',
    fullName: 'Институт Математики и Компьютерных Технологий',
    shortName: 'ИМКТ',
  },
  {
    code: 'ИНТПМ',
    name: 'ИНТПМ',
    fullName: 'Институт Наукоемких Технологий и Передовых Материалов',
    shortName: 'ИНТПМ',
  },
  {
    code: 'ВИ',
    name: 'ВИ',
    fullName: 'Восточный Институт',
    shortName: 'ВИ',
  },
  {
    code: 'ШИГН',
    name: 'ШИГН',
    fullName: 'Школа Искусств и Гуманитарных Наук',
    shortName: 'ШИГН',
  },
  {
    code: 'ШП',
    name: 'ШП',
    fullName: 'Школа Педагогики',
    shortName: 'ШП',
  },
  {
    code: 'ШэМ',
    name: 'ШэМ',
    fullName: 'Школа Экономики и Менеджмента',
    shortName: 'ШэМ',
  },
];

/**
 * Получить информацию о школе по коду или названию
 */
export function getSchoolByCode(code: string): School | undefined {
  return SCHOOLS.find(
    (s) =>
      s.code.toLowerCase() === code.toLowerCase() ||
      s.name.toLowerCase() === code.toLowerCase() ||
      s.shortName.toLowerCase() === code.toLowerCase()
  );
}

/**
 * Получить информацию о школе по полному названию
 */
export function getSchoolByName(name: string): School | undefined {
  return SCHOOLS.find(
    (s) =>
      s.fullName.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(s.fullName.toLowerCase())
  );
}

/**
 * Получить все коды школ
 */
export function getAllSchoolCodes(): string[] {
  return SCHOOLS.map((s) => s.code);
}

/**
 * Нормализовать название института/школы
 */
export function normalizeInstituteName(institute: string | null | undefined): string | null {
  if (!institute) return null;

  const normalized = institute.trim();
  
  // Попытка найти точное совпадение
  const school = getSchoolByCode(normalized) || getSchoolByName(normalized);
  if (school) {
    return school.code;
  }

  // Возвращаем оригинальное название, если не найдено
  return normalized;
}

