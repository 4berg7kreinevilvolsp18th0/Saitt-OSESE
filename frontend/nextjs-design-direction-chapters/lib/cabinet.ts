import { getUserRoles, getCurrentUser, type UserRole, type UserRoleWithDirection } from './auth';
import { supabase } from './supabaseClient';

export type CabinetType = 'member' | 'lead' | 'board' | 'staff' | null;

export interface UserCabinetInfo {
  user: any;
  roles: UserRoleWithDirection[];
  primaryRole: UserRole | null;
  cabinetType: CabinetType;
  hasAccess: boolean;
  directions: Array<{ id: string; title: string; slug: string }>;
}

/**
 * Определить тип кабинета на основе ролей пользователя
 */
export function determineCabinetType(roles: UserRoleWithDirection[]): CabinetType {
  if (roles.length === 0) return null;

  // Приоритет ролей (от высшей к низшей)
  const rolePriority: Record<UserRole, number> = {
    board: 4,
    staff: 3,
    lead: 2,
    member: 1,
  };

  // Находим роль с наивысшим приоритетом
  const sortedRoles = [...roles].sort((a, b) => rolePriority[b.role] - rolePriority[a.role]);
  return sortedRoles[0].role as CabinetType;
}

/**
 * Получить информацию о кабинете пользователя
 */
export async function getUserCabinetInfo(): Promise<UserCabinetInfo | null> {
  const { user, error } = await getCurrentUser();
  if (!user || error) return null;

  const roles = await getUserRoles();
  if (roles.length === 0) return null;

  const primaryRole = determineCabinetType(roles);
  const cabinetType = primaryRole;

  // Получаем направления для ролей с direction_id
  const directionIds = roles
    .map((r) => r.directionId)
    .filter((id): id is string => id !== null);

  let directions: Array<{ id: string; title: string; slug: string }> = [];
  if (directionIds.length > 0) {
    const { data } = await supabase
      .from('directions')
      .select('id, title, slug')
      .in('id', directionIds);
    directions = data || [];
  }

  return {
    user,
    roles,
    primaryRole,
    cabinetType,
    hasAccess: true,
    directions,
  };
}

/**
 * Получить URL кабинета для редиректа
 */
export function getCabinetUrl(cabinetType: CabinetType): string {
  if (!cabinetType) return '/manage/login';
  
  return `/cabinet/${cabinetType}`;
}

/**
 * Проверить доступ к разделу кабинета
 */
export function hasCabinetAccess(
  cabinetType: CabinetType,
  requiredRole: UserRole | UserRole[]
): boolean {
  if (!cabinetType) return false;

  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  // Board и staff имеют доступ ко всем кабинетам
  if (cabinetType === 'board' || cabinetType === 'staff') {
    return true;
  }

  // Проверяем соответствие роли
  return requiredRoles.includes(cabinetType);
}

/**
 * Получить список доступных разделов для роли
 */
export function getAvailableSections(cabinetType: CabinetType): Array<{
  title: string;
  href: string;
  description: string;
  icon?: string;
}> {
  const baseSections = [
    {
      title: 'Профиль',
      href: '/cabinet/profile',
      description: 'Личные данные и настройки',
      icon: '👤',
    },
  ];

  switch (cabinetType) {
    case 'member':
      return [
        ...baseSections,
        {
          title: 'Статистика',
          href: '/cabinet/stats',
          description: 'Ввод статистики обращений',
          icon: '📊',
        },
        {
          title: 'Обращения',
          href: '/cabinet/appeals',
          description: 'Просмотр обращений вашего направления',
          icon: '📝',
        },
      ];

    case 'lead':
      return [
        ...baseSections,
        {
          title: 'Статистика',
          href: '/cabinet/stats',
          description: 'Ввод статистики обращений',
          icon: '📊',
        },
        {
          title: 'Обращения',
          href: '/cabinet/appeals',
          description: 'Управление обращениями вашего направления',
          icon: '📝',
        },
        {
          title: 'Контент',
          href: '/cabinet/content',
          description: 'Управление новостями и гайдами',
          icon: '📰',
        },
        {
          title: 'Дашборды',
          href: '/cabinet/dashboards',
          description: 'Аналитика по направлению',
          icon: '📈',
        },
      ];

    case 'board':
      return [
        ...baseSections,
        {
          title: 'Статистика',
          href: '/cabinet/stats',
          description: 'Ввод и просмотр статистики',
          icon: '📊',
        },
        {
          title: 'Обращения',
          href: '/cabinet/appeals',
          description: 'Управление всеми обращениями',
          icon: '📝',
        },
        {
          title: 'Контент',
          href: '/cabinet/content',
          description: 'Управление всем контентом',
          icon: '📰',
        },
        {
          title: 'Дашборды',
          href: '/cabinet/dashboards',
          description: 'Полная аналитика',
          icon: '📈',
        },
        {
          title: 'Пользователи',
          href: '/cabinet/users',
          description: 'Управление ролями пользователей',
          icon: '👥',
        },
        {
          title: 'Настройки',
          href: '/cabinet/settings',
          description: 'Системные настройки',
          icon: '⚙️',
        },
      ];

    case 'staff':
      return [
        ...baseSections,
        {
          title: 'Обращения',
          href: '/cabinet/appeals',
          description: 'Просмотр всех обращений',
          icon: '📝',
        },
        {
          title: 'Дашборды',
          href: '/cabinet/dashboards',
          description: 'Просмотр аналитики',
          icon: '📈',
        },
        {
          title: 'Настройки',
          href: '/cabinet/settings',
          description: 'Технические настройки',
          icon: '⚙️',
        },
      ];

    default:
      return baseSections;
  }
}

