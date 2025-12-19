# Загрузка тестовых данных и назначение ролей

## Быстрая инструкция

### 1. Загрузка тестовых обращений

Выполните SQL скрипт для создания тестовых обращений во все комитеты:

1. Зайдите в **Supabase Dashboard** → **SQL Editor**
2. Откройте файл `database/load_test_appeals.sql`
3. Скопируйте весь SQL код
4. Вставьте в SQL Editor и нажмите **"Run"**
5. Скрипт создаст обращения за последние 90 дней с разными статусами

**Результат:** 
- ~90 обращений в правовой комитет
- ~90 обращений в инфраструктурный блок
- ~60 обращений в стипендиальный комитет
- ~25 обращений для иностранных студентов
- ~9 обращений в категорию "Другое"

### 2. Назначение ролей пользователям

#### Шаг 1: Создайте пользователей в Supabase Auth

1. Зайдите в **Supabase Dashboard** → **Authentication** → **Users**
2. Нажмите **"Add user"** → **"Create new user"**
3. Создайте пользователей для:
   - @herman_east
   - @EvilBaby_infern
   - @schatoff

**Важно:** Запишите email каждого пользователя!

#### Шаг 2: Найдите UUID пользователей

1. В **Authentication** → **Users** найдите каждого пользователя
2. Нажмите на пользователя, чтобы открыть детали
3. Скопируйте **UUID** (User UID) - это длинная строка вида: `12345678-1234-1234-1234-123456789abc`

#### Шаг 3: Назначьте роли

1. Зайдите в **SQL Editor**
2. Откройте файл `database/assign_roles.sql`
3. Выберите один из вариантов:

**Вариант A: По email (если знаете email пользователей)**

Замените в скрипте:
```sql
WHERE email = 'herman_east@example.com'  -- на реальный email
```

**Вариант B: По UUID (если знаете UUID)**

Раскомментируйте секцию "Вариант 2" и замените:
```sql
'ЗАМЕНИТЕ_НА_UUID_HERMAN_EAST'  -- на реальный UUID
```

4. Выполните скрипт

#### Шаг 4: Проверьте результат

Выполните проверочный запрос в конце скрипта `assign_roles.sql`:
```sql
SELECT 
    u.email,
    ur.role,
    d.title as direction,
    ur.created_at
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
LEFT JOIN directions d ON ur.direction_id = d.id
ORDER BY u.email, ur.role;
```

## Роли и их возможности

| Роль | Описание | Направление | Доступ |
|------|----------|-------------|--------|
| `board` | Руководство ОСС | NULL | Видит все обращения, может управлять всеми |
| `lead` | Руководитель направления | Указано | Видит обращения своего направления, может управлять ими |
| `member` | Член ОСС | Указано | Видит обращения своего направления, ограниченные права |
| `staff` | Аппарат | NULL | Видит все обращения, ограниченные права на изменение |

## Примеры назначения ролей

### @herman_east - Руководство ОСС
```sql
INSERT INTO user_roles (user_id, role, direction_id)
SELECT id, 'board', NULL
FROM auth.users
WHERE email = 'herman_east@example.com';
```

### @EvilBaby_infern - Руководитель правового комитета
```sql
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 
    u.id,
    'lead',
    d.id
FROM auth.users u
CROSS JOIN directions d
WHERE u.email = 'evilbaby_infern@example.com'
  AND d.slug = 'legal';
```

### @schatoff - Член инфраструктурного блока
```sql
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 
    u.id,
    'member',
    d.id
FROM auth.users u
CROSS JOIN directions d
WHERE u.email = 'schatoff@example.com'
  AND d.slug = 'infrastructure';
```

## Проверка графики

После загрузки данных:

1. Откройте страницу **Статистика** (`/statistics`)
   - Должны отображаться графики с данными
   - Динамика по дням
   - Распределение по направлениям

2. Откройте **Админ-панель** → **Дашборды** (`/admin/dashboards`)
   - Должны отображаться карточки со статистикой
   - График по статусам
   - Среднее время ответа

3. Откройте **Админ-панель** → **Обращения** (`/admin/appeals`)
   - Должны отображаться обращения в Kanban доске
   - Можно перемещать между статусами

## Удаление тестовых данных

Если нужно удалить все тестовые обращения:

```sql
DELETE FROM appeals 
WHERE title LIKE '%Тестовое обращение%' 
   OR title LIKE '%Вопрос по правовым нормам%'
   OR title LIKE '%Поломка в общежитии%'
   OR title LIKE '%Не пришла стипендия%';
```

Или удалить все обращения:

```sql
DELETE FROM appeals;
```

## Проблемы?

1. **Ошибка "relation does not exist":**
   - Убедитесь, что выполнили `database/schema.sql` перед этим

2. **Ошибка "user not found":**
   - Проверьте, что пользователи созданы в Supabase Auth
   - Проверьте правильность email или UUID

3. **Графики не отображаются:**
   - Проверьте, что данные загружены (выполните проверочный запрос)
   - Проверьте консоль браузера на ошибки
   - Убедитесь, что таблицы `appeals_public_daily` и `appeals_public_by_direction` существуют

