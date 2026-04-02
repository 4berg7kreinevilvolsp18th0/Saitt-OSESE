import { dbQuery } from '../db';

export async function getUserRolesByUserId(userId: string) {
  const res = await dbQuery<{ role: 'member' | 'lead' | 'board' | 'staff'; direction_id: string | null }>`
    select role, direction_id
    from user_roles
    where user_id = ${userId}::uuid
  `;
  return res.rows;
}
