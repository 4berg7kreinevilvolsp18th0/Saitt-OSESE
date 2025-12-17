# Инструкция по настройке проекта

## Быстрый старт

### 1. Клонирование и установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd "Saitt OSESE"

# Установить зависимости frontend
cd frontend/nextjs
npm install
# или
pnpm install
```

### 2. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Перейдите в SQL Editor
3. Выполните в порядке:
   - `database/schema.sql` - создаст таблицы и RLS политики
   - `database/analytics.sql` - создаст таблицы для публичной статистики
   - `database/seed.sql` - (опционально) тестовые данные

### 3. Настройка переменных окружения

Создайте файл `frontend/nextjs/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Найти эти значения можно в Supabase Dashboard → Settings → API

### 4. Настройка аутентификации

1. В Supabase Dashboard включите Authentication
2. Создайте пользователей через Authentication → Users
3. Добавьте роли в таблицу `user_roles`:

```sql
-- Пример: создать роль для пользователя
INSERT INTO user_roles (user_id, role, direction_id)
VALUES 
  ('<user-uuid-from-auth>', 'board', NULL);
```

Роли:
- `board` - руководство ОСС (видит всё, direction_id = NULL)
- `lead` - руководитель направления (видит обращения своего направления)
- `member` - член ОСС (видит обращения своего направления)
- `staff` - аппарат (видит всё, но не может менять статусы обращений)

### 5. Запуск проекта

```bash
cd frontend/nextjs
npm run dev
```

Сайт будет доступен на [http://localhost:3000](http://localhost:3000)

## Структура базы данных

### Основные таблицы

- `directions` - направления/комитеты ОСС
- `appeals` - обращения студентов
- `appeal_comments` - комментарии к обращениям
- `content` - новости, гайды, FAQ
- `documents` - документы
- `user_roles` - роли пользователей

### RLS политики

Все таблицы защищены Row Level Security:
- Публичные пользователи могут создавать обращения
- Публичные пользователи могут читать обращения только по `public_token`
- Члены ОСС видят только обращения своего направления
- Board и staff видят все обращения

## Проверка работы

### Тест публичной части
1. Откройте [http://localhost:3000](http://localhost:3000)
2. Перейдите на `/appeal` и создайте тестовое обращение
3. Сохраните `public_token`
4. Проверьте статус на `/appeal/status`

### Тест админ-панели
1. Откройте `/admin/login`
2. Войдите с учётными данными пользователя с ролью
3. Проверьте доступ к `/admin/appeals` и `/admin/dashboards`

## Деплой на Vercel

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения в Vercel Dashboard
3. Настройте Preview и Production окружения
4. Деплой произойдёт автоматически при push в `main`

## Troubleshooting

### Ошибки доступа к базе данных
- Проверьте переменные окружения
- Проверьте RLS политики в Supabase
- Убедитесь, что пользователь имеет нужные роли

### Ошибки при сборке
- Убедитесь, что установлены все зависимости: `npm install`
- Проверьте версию Node.js (требуется 18+)

### RLS политики не работают
- Убедитесь, что Supabase Auth включен
- Проверьте, что функция `has_role()` создана в БД
- Проверьте, что пользователи имеют записи в `user_roles`

