import 'server-only';

import { auth } from '../auth';
import { getUserRolesByUserId } from './repositories/userRolesRepo';
import { getUserByEmail, getUserById } from './repositories/usersRepo';

export type SessionUser = {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    fullName: session.user.fullName ?? null,
    createdAt: session.user.createdAt ?? null,
  };
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function getCurrentUserRoles() {
  const user = await getSessionUser();
  if (!user) {
    return [];
  }

  const roles = await getUserRolesByUserId(user.id);
  return roles.map((role) => ({
    role: role.role,
    directionId: role.direction_id,
  }));
}

export async function requireRole(requiredRole: 'member' | 'lead' | 'board' | 'staff' | Array<'member' | 'lead' | 'board' | 'staff'>) {
  const roles = await getCurrentUserRoles();
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  const hasRequiredRole = roles.some((role) => requiredRoles.includes(role.role));
  if (!hasRequiredRole) {
    throw new Error('Forbidden');
  }

  return roles;
}

export async function findUserByEmail(email: string) {
  return getUserByEmail(email);
}

export async function getSessionDbUser() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return null;
  }

  return getUserById(sessionUser.id);
}
