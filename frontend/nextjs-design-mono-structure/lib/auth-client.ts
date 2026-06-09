'use client';

import { getSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

export async function authClientSignIn(email: string, password: string) {
  const result = await nextAuthSignIn('credentials', {
    email,
    password,
    redirect: false,
  });

  if (!result) {
    return { error: { message: 'Не удалось выполнить вход' } };
  }

  if (result.error) {
    return { error: { message: result.error } };
  }

  return { error: null };
}

export async function authClientSignOut() {
  await nextAuthSignOut({ redirect: false });
  return { error: null };
}

export async function authClientGetSessionUser() {
  const session = await getSession();
  return session?.user ?? null;
}
