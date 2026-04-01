import { sql } from '@vercel/postgres';

export const useVercelPostgres = process.env.USE_VERCEL_POSTGRES === 'true';

export async function dbQuery<T = unknown>(strings: TemplateStringsArray, ...values: unknown[]) {
  return sql<T>(strings, ...values);
}

export function assertPostgresEnabled() {
  if (!useVercelPostgres) {
    throw new Error('Vercel Postgres отключен (USE_VERCEL_POSTGRES=false)');
  }
}
