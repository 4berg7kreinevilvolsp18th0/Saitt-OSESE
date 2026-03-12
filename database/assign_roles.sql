-- ===============================
-- Назначение ролей пользователям
-- ===============================
-- ВАЖНО: Перед выполнением этого скрипта нужно:
-- 1. Создать пользователей в Supabase Auth (Authentication → Users)
-- 2. Найти их UUID (User UID) в Supabase Dashboard
-- 3. Заменить placeholder UUID ниже на реальные UUID пользователей

-- ===============================
-- ИНСТРУКЦИЯ: Как найти UUID пользователя
-- ===============================
-- 1. Зайдите в Supabase Dashboard → Authentication → Users
-- 2. Найдите пользователя по email или username
-- 3. Скопируйте его UUID (User UID) - это длинная строка вида: 12345678-1234-1234-1234-123456789abc
-- 4. Замените placeholder UUID ниже на реальные

-- ===============================
-- НАСТРОЙКА: Замените UUID на реальные
-- ===============================

-- Пример структуры (замените на реальные UUID):
-- @herman_east - замените UUID_HERMAN_EAST на реальный UUID
-- @EvilBaby_infern - замените UUID_EVILBABY на реальный UUID
-- @schatoff - замените UUID_SCHATOFF на реальный UUID

-- ===============================
-- Вариант 1: Назначение ролей по email (если пользователи уже созданы)
-- ===============================

-- Для @herman_east (предполагаем роль board - руководство ОСС) (например, руководство ОСС)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT
    id as user_id,
    'board' as role,
    NULL as direction_id
FROM auth.users
WHERE email = 'herman_east@example.com'  -- ЗАМЕНИТЕ на реальный email (например, herman_east@example.com)
ON CONFLICT (user_id, role, direction_id) DO NOTHING;

-- Для @EvilBaby_infern (предполагаем роль lead - руководитель направления) (например, руководитель правового комитета)
-- Сначала нужно узнать ID направления (например, правовой комитет)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT
    u.id as user_id,
    'lead' as role,
    d.id as direction_id
FROM auth.users u
CROSS JOIN directions d
WHERE u.email = 'evilbaby_infern@example.com'  -- ЗАМЕНИТЕ на реальный email (например, evilbaby_infern@example.com)
  AND d.slug = 'legal'  -- Или другое направление (например, правовой комитет)
ON CONFLICT (user_id, role, direction_id) DO NOTHING;

-- Для @schatoff (предполагаем роль member - член ОСС) (например, член инфраструктурного блока)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT
    u.id as user_id,
    'member' as role,
    d.id as direction_id
FROM auth.users u
CROSS JOIN directions d
WHERE u.email = 'schatoff@example.com'  -- ЗАМЕНИТЕ на реальный email (например, schatoff@example.com)
  AND d.slug = 'infrastructure'  -- Или другое направление (например, инфраструктурный блок)
ON CONFLICT (user_id, role, direction_id) DO NOTHING;

-- ===============================
-- Вариант 2: Назначение ролей по UUID напрямую (если знаете UUID)
-- ===============================

-- Раскомментируйте и замените UUID на реальные:

/*
-- @herman_east - руководство ОСС (board)
INSERT INTO user_roles (user_id, role, direction_id)
VALUES
    ('ЗАМЕНИТЕ_НА_UUID_HERMAN_EAST', 'board', NULL) для UUID_HERMAN_EAST на реальный UUID
ON CONFLICT (user_id, role, direction_id) DO NOTHING; для board на реальную роль

-- @EvilBaby_infern - руководитель правового комитета (lead)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT
    'ЗАМЕНИТЕ_НА_UUID_EVILBABY'::uuid, для UUID_EVILBABY на реальный UUID
    'lead', для lead на реальную роль
    id для id на реальный ID направления (например, правовой комитет)
FROM directions
WHERE slug = 'legal'
ON CONFLICT (user_id, role, direction_id) DO NOTHING;

-- @schatoff - член инфраструктурного блока (member)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT
    'ЗАМЕНИТЕ_НА_UUID_SCHATOFF'::uuid, для UUID_SCHATOFF на реальный UUID
    'member', для member на реальную роль
    id для id на реальный ID направления
FROM directions
WHERE slug = 'infrastructure'
ON CONFLICT (user_id, role, direction_id) DO NOTHING;
*/

-- ===============================
-- Проверка назначенных ролей
-- ===============================

SELECT
    u.email,
    ur.role,
    d.title as direction,
    ur.created_at
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
LEFT JOIN directions d ON ur.direction_id = d.id
ORDER BY u.email, ur.role;

-- ===============================
-- ПРИМЕЧАНИЯ
-- ===============================
-- 1. Роли:
--    - 'board' - руководство ОСС (видит все обращения, direction_id = NULL) (например, руководство ОСС)
--    - 'lead' - руководитель направления (видит обращения своего направления) (например, руководитель правового комитета)
--    - 'member' - член ОСС (видит обращения своего направления) (например, член правового комитета)
--    - 'staff' - аппарат (видит все, но ограниченные права) (например, техническая поддержка)
--
-- 2. Если нужно назначить несколько ролей одному пользователю:
--    - Можно выполнить несколько INSERT для одного user_id (например, для назначения роли руководителя правового комитета и члена правового комитета)
--    - Например, пользователь может быть и 'board' и 'lead' для какого-то направления (например, правовой комитет)
--
-- 3. Если нужно удалить роль:
--    DELETE FROM user_roles WHERE user_id = 'UUID' AND role = 'role_name'; для удаления роли пользователя

