-- Скрипт для проверки, что все таблицы созданы правильно
-- Выполните этот скрипт в Supabase SQL Editor для проверки

-- Проверка существования таблиц
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

-- Проверка индексов
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

-- Проверка RLS (Row Level Security)
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

-- Проверка политик RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    '✅ Создана' as status
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

