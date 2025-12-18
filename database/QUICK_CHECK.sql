-- Быстрая проверка загруженных данных
-- Выполните этот скрипт, чтобы увидеть, что было загружено

-- Направления
SELECT 'Направления: ' || COUNT(*)::text as info FROM directions WHERE is_active = true;

-- Обращения
SELECT 'Обращения: ' || COUNT(*)::text as info FROM appeals;

-- Контент (новости и гайды)
SELECT 'Контент: ' || COUNT(*)::text || ' (новостей: ' || COUNT(*) FILTER (WHERE type = 'news')::text || ', гайдов: ' || COUNT(*) FILTER (WHERE type = 'guide')::text || ')' as info 
FROM content;

-- Показать первые 3 направления
SELECT 'Направление: ' || title as info FROM directions WHERE is_active = true LIMIT 3;

