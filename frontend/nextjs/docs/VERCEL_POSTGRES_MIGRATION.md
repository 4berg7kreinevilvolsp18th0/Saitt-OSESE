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

## 4) Стратегия Auth (A-bridge)

Текущий релиз использует bridge:

- аутентификация остаётся в Supabase Auth;
- роли читаются через `/api/auth/roles`, который умеет работать и с Supabase, и с Vercel Postgres.

## 5) Rollback

Если обнаружена критическая проблема:

1. Переключить `USE_VERCEL_POSTGRES=false`
2. Переключить `NEXT_PUBLIC_USE_VERCEL_POSTGRES=false`
3. Redeploy

Кодовые пути вернутся на Supabase data layer.
