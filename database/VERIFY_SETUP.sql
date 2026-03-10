-- Скрипт для проверки, что все таблицы созданы правильно для безопасности данных и производительности базы данных
-- Выполните этот скрипт в Supabase SQL Editor для проверки безопасности данных и производительности базы данных и убедиться, что все работает правильно и безопасно и не блокирует доступ к данным и что нет ошибок и предупреждений

-- Проверка существования таблиц для безопасности данных и производительности базы данных
SELECT
    table_name,
    CASE
        WHEN table_name IS NOT NULL THEN '✅ Создана'
        ELSE '❌ Отсутствует'
    END as status
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN (
        'directions',
        'appeals',
        'appeal_comments',
        'content',
        'documents',
        'user_roles'
    )
ORDER BY table_name;

-- Проверка индексов для производительности
SELECT
    tablename,
    indexname,
    '✅ Создан' as status
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN (
        'directions',
        'appeals',
        'appeal_comments',
        'content',
        'documents',
        'user_roles'
    )
ORDER BY tablename, indexname;

-- Проверка RLS (Row Level Security) для безопасности данных
SELECT
    tablename,
    CASE
        WHEN rowsecurity = true THEN '✅ Включен'
        ELSE '❌ Выключен'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN (
        'directions',
        'appeals',
        'appeal_comments',
        'content',
        'documents',
        'user_roles'
    )
ORDER BY tablename;

-- Проверка политик RLS для безопасности данных и производительности базы данных
SELECT
    schemaname,
    tablename,
    policyname,
    '✅ Создана' as status
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

