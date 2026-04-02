/**
 * Bootstrap внутреннего пользователя в Postgres/Auth.js.
 *
 * Использование:
 * BOOTSTRAP_USER_EMAIL=admin@example.com
 * BOOTSTRAP_USER_PASSWORD='strong password'
 * BOOTSTRAP_USER_FULL_NAME='OSS Admin'
 * BOOTSTRAP_USER_ROLE=board
 * BOOTSTRAP_USER_DIRECTION_ID=<uuid optional>
 * npx tsx scripts/create-admin.ts
 */

import { dbQuery } from '../lib/db';
import { hashPassword } from '../lib/password';
import { upsertUser } from '../lib/repositories/usersRepo';

const email = process.env.BOOTSTRAP_USER_EMAIL;
const password = process.env.BOOTSTRAP_USER_PASSWORD;
const fullName = process.env.BOOTSTRAP_USER_FULL_NAME ?? 'OSS Admin';
const role = (process.env.BOOTSTRAP_USER_ROLE ?? 'board') as 'member' | 'lead' | 'board' | 'staff';
const directionId = process.env.BOOTSTRAP_USER_DIRECTION_ID ?? null;
const userId = process.env.BOOTSTRAP_USER_ID;

if (!email || !password) {
  console.error('BOOTSTRAP_USER_EMAIL и BOOTSTRAP_USER_PASSWORD обязательны');
  process.exit(1);
}

async function createAdminAccount() {
  console.log('Создание внутреннего пользователя в Postgres/Auth.js...');

  const passwordHash = await hashPassword(password);
  const user = await upsertUser({
    id: userId,
    email,
    passwordHash,
    fullName,
    emailVerifiedAt: new Date().toISOString(),
    isActive: true,
  });

  if (!user) {
    throw new Error('Не удалось создать пользователя');
  }

  await dbQuery`
    insert into user_roles (user_id, role, direction_id)
    values (${user.id}::uuid, ${role}, ${directionId}::uuid)
    on conflict (user_id, role, direction_id) do update
      set updated_at = now()
  `;

  console.log('Готово.');
  console.log(`User ID: ${user.id}`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${role}`);
  console.log('Пароль сохранен только в виде hash в таблице users.');
}

createAdminAccount().catch((error) => {
  console.error('Критическая ошибка:', error);
  process.exit(1);
});

