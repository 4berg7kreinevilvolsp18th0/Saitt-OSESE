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
