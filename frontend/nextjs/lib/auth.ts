import { supabase } from './supabaseClient';

export type UserRole = 'member' | 'lead' | 'board' | 'staff';

export type UserRoleWithDirection = {
  role: UserRole;
  directionId: string | null;
};

/**
 * Получить текущего авторизованного пользователя
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Получить роли пользователя
 */
export async function getUserRoles(): Promise<UserRoleWithDirection[]> {
  const { user } = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_roles')
    .select('role, direction_id')
    .eq('user_id', user.id);

  if (error || !data) return [];

  return data.map((r) => ({
    role: r.role as UserRole,
    directionId: r.direction_id,
  }));
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
 * Войти через Supabase Auth
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Выйти
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

