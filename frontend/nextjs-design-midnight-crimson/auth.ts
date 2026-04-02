import { getServerSession } from 'next-auth';

import { authConfig } from './lib/auth.config';

export const authOptions = authConfig;

export function auth() {
  return getServerSession(authOptions);
}
