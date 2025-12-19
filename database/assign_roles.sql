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

-- Для @herman_east (предполагаем роль board - руководство ОСС)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 
    id as user_id,
    'board' as role,
    NULL as direction_id
FROM auth.users
WHERE email = 'herman_east@example.com'  -- ЗАМЕНИТЕ на реальный email
ON CONFLICT (user_id, role, direction_id) DO NOTHING;

-- Для @EvilBaby_infern (предполагаем роль lead - руководитель направления)
-- Сначала нужно узнать ID направления (например, правовой комитет)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 
    u.id as user_id,
    'lead' as role,
    d.id as direction_id
FROM auth.users u
CROSS JOIN directions d
WHERE u.email = 'evilbaby_infern@example.com'  -- ЗАМЕНИТЕ на реальный email
  AND d.slug = 'legal'  -- Или другое направление
ON CONFLICT (user_id, role, direction_id) DO NOTHING;

-- Для @schatoff (предполагаем роль member - член ОСС)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 
    u.id as user_id,
    'member' as role,
    d.id as direction_id
FROM auth.users u
CROSS JOIN directions d
WHERE u.email = 'schatoff@example.com'  -- ЗАМЕНИТЕ на реальный email
  AND d.slug = 'infrastructure'  -- Или другое направление
ON CONFLICT (user_id, role, direction_id) DO NOTHING;

-- ===============================
-- Вариант 2: Назначение ролей по UUID напрямую (если знаете UUID)
-- ===============================

-- Раскомментируйте и замените UUID на реальные:

/*
-- @herman_east - руководство ОСС (board)
INSERT INTO user_roles (user_id, role, direction_id)
VALUES 
    ('ЗАМЕНИТЕ_НА_UUID_HERMAN_EAST', 'board', NULL)
ON CONFLICT (user_id, role, direction_id) DO NOTHING;

-- @EvilBaby_infern - руководитель правового комитета (lead)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 
    'ЗАМЕНИТЕ_НА_UUID_EVILBABY'::uuid,
    'lead',
    id
FROM directions
WHERE slug = 'legal'
ON CONFLICT (user_id, role, direction_id) DO NOTHING;

-- @schatoff - член инфраструктурного блока (member)
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 
    'ЗАМЕНИТЕ_НА_UUID_SCHATOFF'::uuid,
    'member',
    id
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
--    - 'board' - руководство ОСС (видит все обращения, direction_id = NULL)
--    - 'lead' - руководитель направления (видит обращения своего направления)
--    - 'member' - член ОСС (видит обращения своего направления)
--    - 'staff' - аппарат (видит все, но ограниченные права)
--
-- 2. Если нужно назначить несколько ролей одному пользователю:
--    - Можно выполнить несколько INSERT для одного user_id
--    - Например, пользователь может быть и 'board' и 'lead' для какого-то направления
--
-- 3. Если нужно удалить роль:
--    DELETE FROM user_roles WHERE user_id = 'UUID' AND role = 'role_name';

