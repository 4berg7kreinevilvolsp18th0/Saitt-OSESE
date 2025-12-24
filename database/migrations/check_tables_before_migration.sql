-- ===============================
-- Проверка существования таблиц перед выполнением миграций
-- ===============================
-- 
-- Этот скрипт проверяет, что все необходимые таблицы созданы
-- Выполните его перед применением других миграций
--

DO $$
DECLARE
    missing_tables text[];
    required_tables text[] := ARRAY[
        'appeals',
        'appeal_attachments',
        'appeal_comments',
        'content',
        'directions',
        'documents',
        'user_roles'
    ];
    tbl text;
BEGIN
    -- Проверяем каждую таблицу
    FOREACH tbl IN ARRAY required_tables
    LOOP
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = tbl
        ) THEN
            missing_tables := array_append(missing_tables, tbl);
        END IF;
    END LOOP;
    
    -- Если есть отсутствующие таблицы, выводим ошибку
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE EXCEPTION 'Отсутствуют необходимые таблицы: %. Сначала выполните database/schema.sql', 
            array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE 'Все необходимые таблицы существуют. Можно выполнять миграции.';
    END IF;
END $$;

