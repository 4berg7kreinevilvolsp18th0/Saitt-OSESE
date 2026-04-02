import { dbQuery } from '../db';

export type DbUser = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const res = await dbQuery<DbUser>`
    select id, email, password_hash, full_name, is_active, email_verified_at, created_at, updated_at
    from users
    where lower(email) = ${normalizedEmail}
    limit 1
  `;
  return res.rows[0] ?? null;
}

export async function getUserById(userId: string) {
  const res = await dbQuery<DbUser>`
    select id, email, password_hash, full_name, is_active, email_verified_at, created_at, updated_at
    from users
    where id = ${userId}::uuid
    limit 1
  `;
  return res.rows[0] ?? null;
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  const res = await dbQuery<DbUser>`
    update users
    set password_hash = ${passwordHash},
        updated_at = now()
    where id = ${userId}::uuid
    returning id, email, password_hash, full_name, is_active, email_verified_at, created_at, updated_at
  `;
  return res.rows[0] ?? null;
}

export async function upsertUser(input: {
  id?: string;
  email: string;
  passwordHash: string;
  fullName?: string | null;
  isActive?: boolean;
  emailVerifiedAt?: string | null;
}) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const res = await dbQuery<DbUser>`
    insert into users (id, email, password_hash, full_name, is_active, email_verified_at)
    values (
      coalesce(${input.id ?? null}::uuid, gen_random_uuid()),
      ${normalizedEmail},
      ${input.passwordHash},
      ${input.fullName ?? null},
      coalesce(${input.isActive ?? true}, true),
      ${input.emailVerifiedAt ?? null}::timestamptz
    )
    on conflict (email) do update
      set password_hash = excluded.password_hash,
          full_name = excluded.full_name,
          is_active = excluded.is_active,
          email_verified_at = excluded.email_verified_at,
          updated_at = now()
    returning id, email, password_hash, full_name, is_active, email_verified_at, created_at, updated_at
  `;
  return res.rows[0] ?? null;
}

export async function getUsersByIds(userIds: string[]) {
  if (userIds.length === 0) {
    return [];
  }

  const res = await dbQuery<Pick<DbUser, 'id' | 'email' | 'full_name' | 'is_active'>>`
    select id, email, full_name, is_active
    from users
    where id = any(${userIds}::uuid[])
    order by email asc
  `;
  return res.rows;
}

export async function getActiveUsers(limit = 100) {
  const res = await dbQuery<Pick<DbUser, 'id' | 'email' | 'full_name' | 'is_active'>>`
    select id, email, full_name, is_active
    from users
    where is_active = true
    order by email asc
    limit ${limit}
  `;
  return res.rows;
}
