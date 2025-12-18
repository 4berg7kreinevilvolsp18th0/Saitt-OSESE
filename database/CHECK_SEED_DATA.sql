-- Скрипт для проверки загруженных данных из seed.sql
-- Выполните этот скрипт в Supabase SQL Editor

-- 1. Проверка направлений (directions)
SELECT 
    'Направления' as table_name,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) >= 5 THEN '✅ Данные загружены'
        WHEN COUNT(*) > 0 THEN '⚠️ Частично загружены'
        ELSE '❌ Данные отсутствуют'
    END as status
FROM directions
WHERE is_active = true;

-- Список направлений
SELECT 
    slug,
    title,
    color_key,
    is_active,
    created_at
FROM directions
ORDER BY created_at;

-- 2. Проверка обращений (appeals)
SELECT 
    'Обращения' as table_name,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE status = 'new') as new_count,
    COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
    COUNT(*) FILTER (WHERE status = 'closed') as closed_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Данные загружены'
        ELSE '❌ Данные отсутствуют'
    END as status
FROM appeals;

-- 3. Проверка контента (content)
SELECT 
    'Контент' as table_name,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE type = 'news') as news_count,
    COUNT(*) FILTER (WHERE type = 'guide') as guide_count,
    COUNT(*) FILTER (WHERE status = 'published') as published_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Данные загружены'
        ELSE '❌ Данные отсутствуют'
    END as status
FROM content;

-- Список опубликованного контента
SELECT 
    type,
    title,
    slug,
    status,
    direction_id,
    published_at
FROM content
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 10;

-- 4. Проверка связей (направления с контентом)
SELECT 
    d.title as direction_title,
    COUNT(c.id) as content_count,
    COUNT(DISTINCT CASE WHEN c.type = 'news' THEN c.id END) as news_count,
    COUNT(DISTINCT CASE WHEN c.type = 'guide' THEN c.id END) as guide_count
FROM directions d
LEFT JOIN content c ON c.direction_id = d.id AND c.status = 'published'
WHERE d.is_active = true
GROUP BY d.id, d.title
ORDER BY d.title;

