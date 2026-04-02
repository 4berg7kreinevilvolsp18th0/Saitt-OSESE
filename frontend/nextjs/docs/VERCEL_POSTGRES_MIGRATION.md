# Миграция на Vercel Postgres

## 1) Переменные окружения

Обязательные переменные (Vercel Project Settings):

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

Флаги приложения:

- `USE_VERCEL_POSTGRES=true`
- `NEXT_PUBLIC_USE_VERCEL_POSTGRES=true`

## 2) Схема

Выполнить SQL:

- `database/migrations/001_init_vercel_postgres.sql`

Этот файл специально удаляет Supabase-only части (`auth.users`, RLS, `auth.uid()`), чтобы схема работала в обычном Postgres.

## 3) Экспорт / импорт данных

Рекомендуемый порядок:

1. `directions`
2. `content`
3. `documents`
4. `student_organizations`
5. `appeals`
6. `appeal_comments`
7. `appeal_attachments`
8. `user_roles`

Проверки после импорта:

- `count(*)` по каждой таблице;
- выборочные проверки `slug`, `status`, `published_at`, `public_token`;
- проверка ссылочной целостности (FK).

## 4) Auth.js / Postgres

Текущий auth-контур больше не опирается на Supabase Auth:

- вход работает через `Auth.js` (`CredentialsProvider`);
- сессия хранится как JWT;
- пользователи хранятся в таблице `users`;
- роли читаются напрямую из Postgres по `session.user.id`.

Выполнить дополнительно SQL:

- `database/migrations/002_auth_users.sql`

Обязательные переменные окружения для auth:

- `AUTH_SECRET` или `NEXTAUTH_SECRET`

### Bootstrap внутренних аккаунтов

Для первого релиза внутренние аккаунты создаются bootstrap-скриптом, а не через публичную регистрацию:

```bash
BOOTSTRAP_USER_EMAIL=admin@example.com
BOOTSTRAP_USER_PASSWORD='strong password'
BOOTSTRAP_USER_FULL_NAME='OSS Admin'
BOOTSTRAP_USER_ROLE=board
npx tsx scripts/create-admin.ts
```

### Временное состояние 2FA

- `2FA` намеренно отключен в UI и API;
- возврат 2FA запланирован отдельным релизом уже поверх `Auth.js + Postgres`.

## 5) Историческая bridge-стадия

Промежуточный релиз использовал bridge:

- аутентификация остаётся в Supabase Auth;
- роли читаются через `/api/auth/roles`, который умеет работать и с Supabase, и с Vercel Postgres.

Эта стадия больше не является целевой архитектурой.

## 6) Rollback

Если обнаружена критическая проблема:

1. Переключить `USE_VERCEL_POSTGRES=false`
2. Переключить `NEXT_PUBLIC_USE_VERCEL_POSTGRES=false`
3. Redeploy

Кодовые пути вернутся на Supabase data layer.
