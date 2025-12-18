# Настройка Supabase для проекта ОСС ДВФУ

## Проблема: 404 ошибка или Supabase не подключен

Если вы видите ошибку `404: NOT_FOUND` или сайт не работает, скорее всего проблема в том, что Supabase не настроен.

## Быстрая настройка

### 1. Создание проекта Supabase

1. Зайдите на [supabase.com](https://supabase.com)
2. Войдите или создайте аккаунт
3. Нажмите "New Project"
4. Заполните форму:
   - **Name:** oss-dvfu (или любое другое имя)
   - **Database Password:** придумайте надежный пароль (сохраните его!)
   - **Region:** выберите ближайший регион
5. Нажмите "Create new project"
6. Дождитесь создания проекта (2-3 минуты)

### 2. Получение ключей API

1. В Supabase Dashboard перейдите в **Settings** → **API**
2. Найдите секцию **Project URL** - это ваш `NEXT_PUBLIC_SUPABASE_URL`
3. Найдите секцию **Project API keys** → **anon public** - это ваш `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Настройка базы данных

1. Перейдите в **SQL Editor** в Supabase Dashboard
2. Выполните файлы в следующем порядке:

#### Шаг 1: Схема базы данных
```sql
-- Скопируйте и выполните содержимое файла database/schema.sql
```

#### Шаг 2: (Опционально) Тестовые данные
```sql
-- Скопируйте и выполните содержимое файла database/seed.sql
```

### 4. Настройка переменных окружения

#### Для локальной разработки:

1. Создайте файл `.env.local` в папке `frontend/nextjs/`:
```bash
cd frontend/nextjs
cp .env.example .env.local
```

2. Откройте `.env.local` и заполните значения:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-ключ
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Перезапустите dev-сервер:
```bash
npm run dev
```

#### Для Vercel (продакшн):

1. Зайдите в Vercel Dashboard → ваш проект → **Settings** → **Environment Variables**
2. Добавьте следующие переменные:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ваш-проект.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `ваш-anon-ключ` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://ваш-домен.vercel.app` | Production, Preview, Development |

3. Нажмите "Save"
4. Перезапустите деплой (Redeploy) в Vercel Dashboard

### 5. Включение Authentication

1. В Supabase Dashboard перейдите в **Authentication** → **Providers**
2. Убедитесь, что **Email** провайдер включен
3. (Опционально) Настройте другие провайдеры (Google, GitHub и т.д.)

### 6. Создание первого пользователя

1. Перейдите в **Authentication** → **Users**
2. Нажмите "Add user" → "Create new user"
3. Заполните email и пароль
4. После создания пользователя, скопируйте его **UUID** (User UID)

### 7. Назначение ролей

Выполните SQL запрос в **SQL Editor** для назначения роли:

```sql
-- Для руководства ОСС (board)
INSERT INTO user_roles (user_id, role, direction_id)
VALUES ('<user-uuid-from-auth>', 'board', NULL);

-- Для руководителя направления (lead)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 
  '<user-uuid-from-auth>',
  'lead',
  id
FROM directions
WHERE slug = 'legal'; -- замените на нужный slug

-- Для члена ОСС (member)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 
  '<user-uuid-from-auth>',
  'member',
  id
FROM directions
WHERE slug = 'scholarship'; -- замените на нужный slug

-- Для аппарата (staff)
INSERT INTO user_roles (user_id, role, direction_id)
VALUES ('<user-uuid-from-auth>', 'staff', NULL);
```

## Проверка подключения

### Локально:

1. Откройте консоль браузера (F12)
2. Перейдите на главную страницу
3. Проверьте, нет ли предупреждений о Supabase

### На Vercel:

1. Откройте сайт
2. Откройте консоль браузера (F12)
3. Проверьте Network tab - должны быть запросы к Supabase
4. Если видите ошибки 404 или CORS - проверьте переменные окружения

## Troubleshooting

### Ошибка: "Supabase не настроен"

**Причина:** Переменные окружения не установлены или пустые.

**Решение:**
1. Проверьте файл `.env.local` (локально) или переменные в Vercel
2. Убедитесь, что переменные начинаются с `NEXT_PUBLIC_`
3. Перезапустите dev-сервер или перезапустите деплой в Vercel

### Ошибка: 404 NOT_FOUND

**Причина:** Неправильный URL Supabase или проект не создан.

**Решение:**
1. Проверьте `NEXT_PUBLIC_SUPABASE_URL` - должен быть вида `https://xxxxx.supabase.co`
2. Убедитесь, что проект создан в Supabase Dashboard
3. Проверьте, что проект активен (не приостановлен)

### Ошибка: Invalid API key

**Причина:** Неправильный `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**Решение:**
1. Скопируйте ключ заново из Supabase Dashboard → Settings → API
2. Убедитесь, что используете **anon public** ключ, а не **service_role**
3. Проверьте, что ключ скопирован полностью (без пробелов)

### Ошибка: RLS policy violation

**Причина:** Row Level Security политики блокируют доступ.

**Решение:**
1. Проверьте RLS политики в Supabase Dashboard → Authentication → Policies
2. Убедитесь, что политики для чтения (`SELECT`) настроены для публичного доступа
3. Проверьте файл `database/schema.sql` - все политики должны быть созданы

### База данных пустая

**Причина:** Не выполнены SQL скрипты для создания таблиц.

**Решение:**
1. Выполните `database/schema.sql` в SQL Editor
2. (Опционально) Выполните `database/seed.sql` для тестовых данных
3. Проверьте таблицы в Supabase Dashboard → Table Editor

## Дополнительные ресурсы

- [Документация Supabase](https://supabase.com/docs)
- [Supabase Dashboard](https://app.supabase.com)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

