import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { verifyPassword } from './password';
import { getUserByEmail } from './repositories/usersRepo';

export const authConfig: NextAuthOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
  },
  providers: [
    Credentials({
      name: 'Email и пароль',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === 'string' ? credentials.email : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';

        if (!email || !password) {
          return null;
        }

        const user = await getUserByEmail(email);
        if (!user || !user.is_active) {
          return null;
        }

        const isValidPassword = await verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.full_name ?? user.email,
          fullName: user.full_name,
          createdAt: user.created_at,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.fullName = user.fullName;
        token.createdAt = user.createdAt;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.email = token.email ?? session.user.email ?? '';
        session.user.name = typeof token.name === 'string' ? token.name : session.user.name;
        session.user.fullName =
          typeof token.fullName === 'string' ? token.fullName : session.user.fullName ?? null;
        session.user.createdAt =
          typeof token.createdAt === 'string' ? token.createdAt : session.user.createdAt ?? null;
      }

      return session;
    },
  },
  pages: {
    signIn: '/manage/login',
  },
};
