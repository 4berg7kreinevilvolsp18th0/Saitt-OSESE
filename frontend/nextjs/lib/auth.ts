import { authClientGetSessionUser, authClientSignIn, authClientSignOut } from './auth-client';

export type UserRole = 'member' | 'lead' | 'board' | 'staff';

export type UserRoleWithDirection = {
  role: UserRole;
  directionId: string | null;
};

/**
 * Получить текущего авторизованного пользователя
 */
export async function getCurrentUser() {
  try {
    const user = await authClientGetSessionUser();
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

/**
 * Получить роли пользователя
 */
export async function getUserRoles(): Promise<UserRoleWithDirection[]> {
  const { user } = await getCurrentUser();
  if (!user) return [];

  try {
    const response = await fetch('/api/auth/roles', {
      credentials: 'include',
    });

    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    const rows = (payload?.data || []) as Array<{ role: string; direction_id: string | null }>;
    return rows.map((r) => ({ role: r.role as UserRole, directionId: r.direction_id }));
  } catch {
    return [];
  }
}

/**
 * Проверить, имеет ли пользователь роль
 */
export async function hasRole(
  role: UserRole,
  directionId?: string | null
): Promise<boolean> {
  const roles = await getUserRoles();

  // Board и staff имеют доступ ко всему
  if (roles.some((r) => r.role === 'board' || r.role === 'staff')) {
    return true;
  }

  // Проверка конкретной роли
  if (directionId) {
    return roles.some(
      (r) => r.role === role && (r.directionId === directionId || r.directionId === null)
    );
  }

  return roles.some((r) => r.role === role && r.directionId === null);
}

/**
 * Проверить, является ли пользователь членом ОСС (любая роль кроме student)
 */
export async function isMember(): Promise<boolean> {
  const roles = await getUserRoles();
  return roles.length > 0;
}

/**
 * Войти через Auth.js Credentials
 */
export async function signIn(email: string, password: string) {
  return authClientSignIn(email, password);
}

/**
 * Выйти
 */
export async function signOut() {
  return authClientSignOut();
}

