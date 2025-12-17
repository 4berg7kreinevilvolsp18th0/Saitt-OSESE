# OPERATIONS

## Обновление контента
1) Открыть CMS (Keystatic)
2) Изменить материал
3) Проверить в Staging
4) Опубликовать в Production

## Если сайт не обновился
- Проверить Vercel logs
- Проверить env vars
- Проверить Supabase status

## Настройка аутентификации

### Первоначальная настройка
1. Создайте проект в Supabase
2. Примените `database/schema.sql` в SQL Editor
3. Примените `database/analytics.sql` для статистики
4. Включите Supabase Auth в настройках проекта

### Создание пользователей и ролей
1. Создайте пользователей через Supabase Auth UI или API
2. Добавьте роли в таблицу `user_roles`:

```sql
INSERT INTO user_roles (user_id, role, direction_id)
VALUES 
  ('<user-uuid>', 'board', NULL),  -- Руководство ОСС
  ('<user-uuid>', 'lead', '<direction-uuid>'),  -- Руководитель направления
  ('<user-uuid>', 'member', '<direction-uuid>');  -- Член ОСС
```

### Проверка RLS политик
Используйте SQL Editor для проверки:
- `SELECT auth.uid();` - текущий пользователь
- `SELECT * FROM user_roles WHERE user_id = auth.uid();` - роли пользователя
- `SELECT * FROM appeals;` - должны видеть только доступные обращения

## Установка зависимостей

После клонирования проекта:
```bash
cd frontend/nextjs
npm install
# или
pnpm install
```

Новые зависимости (react-markdown, remark-gfm) будут установлены автоматически.

## Переменные окружения

Убедитесь, что в `.env.local` указаны:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Резервное копирование

Рекомендуется настроить автоматические бэкапы в Supabase:
- Dashboard → Database → Backups
- Настроить расписание бэкапов
