-- ===============================
-- Загрузка тестовых обращений во все комитеты
-- ===============================
-- Этот скрипт создает разнообразные тестовые обращения для проверки графики и статистики

-- Сначала получаем ID всех направлений
DO $$
DECLARE
    legal_id uuid;
    infrastructure_id uuid;
    scholarship_id uuid;
    international_id uuid;
    other_id uuid;
    appeal_date date;
    i integer;
BEGIN
    -- Получаем ID направлений
    SELECT id INTO legal_id FROM directions WHERE slug = 'legal' LIMIT 1;
    SELECT id INTO infrastructure_id FROM directions WHERE slug = 'infrastructure' LIMIT 1;
    SELECT id INTO scholarship_id FROM directions WHERE slug = 'scholarship' LIMIT 1;
    SELECT id INTO international_id FROM directions WHERE slug = 'international' LIMIT 1;
    SELECT id INTO other_id FROM directions WHERE slug = 'other' LIMIT 1;

    -- Создаем обращения за последние 90 дней с разными статусами
    FOR i IN 1..90 LOOP
        appeal_date := CURRENT_DATE - (i - 1);
        
        -- Правовой комитет - разные статусы
        IF i % 4 = 1 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                legal_id,
                'Вопрос по правовым нормам - ' || i,
                'Тестовое обращение в правовой комитет для проверки статистики. Описание ситуации и вопрос студента.',
                'email',
                'student' || i || '@example.com',
                'new',
                appeal_date::timestamp + (random() * interval '12 hours'),
                NULL,
                NULL
            );
        ELSIF i % 4 = 2 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                legal_id,
                'Конфликтная ситуация - ' || i,
                'Тестовое обращение в правовой комитет со статусом "в работе".',
                'telegram',
                '@student' || i,
                'in_progress',
                appeal_date::timestamp + (random() * interval '12 hours'),
                appeal_date::timestamp + interval '2 hours',
                NULL
            );
        ELSIF i % 4 = 3 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                legal_id,
                'Апелляция по оценке - ' || i,
                'Тестовое обращение в правовой комитет со статусом "ждём инфо".',
                'email',
                'student' || i || '@example.com',
                'waiting',
                appeal_date::timestamp + (random() * interval '12 hours'),
                appeal_date::timestamp + interval '1 day',
                NULL
            );
        ELSE
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                legal_id,
                'Решённый вопрос - ' || i,
                'Тестовое обращение в правовой комитет со статусом "закрыто".',
                'telegram',
                '@student' || i,
                'closed',
                appeal_date::timestamp + (random() * interval '12 hours'),
                appeal_date::timestamp + interval '1 day',
                appeal_date::timestamp + interval '3 days'
            );
        END IF;

        -- Инфраструктурный блок
        IF i % 5 = 1 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                infrastructure_id,
                'Поломка в общежитии - ' || i,
                'Тестовое обращение в инфраструктурный блок. Проблема с инфраструктурой.',
                'email',
                'student' || i || '@example.com',
                'new',
                appeal_date::timestamp + (random() * interval '12 hours'),
                NULL,
                NULL
            );
        ELSIF i % 5 = 2 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                infrastructure_id,
                'Проблема с аудиторией - ' || i,
                'Тестовое обращение в инфраструктурный блок со статусом "в работе".',
                'telegram',
                '@student' || i,
                'in_progress',
                appeal_date::timestamp + (random() * interval '12 hours'),
                appeal_date::timestamp + interval '3 hours',
                NULL
            );
        ELSIF i % 5 = 3 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                infrastructure_id,
                'Вопрос по кампусу - ' || i,
                'Тестовое обращение в инфраструктурный блок со статусом "ждём инфо".',
                'email',
                'student' || i || '@example.com',
                'waiting',
                appeal_date::timestamp + (random() * interval '12 hours'),
                appeal_date::timestamp + interval '2 days',
                NULL
            );
        ELSIF i % 5 = 4 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                infrastructure_id,
                'Решённая проблема - ' || i,
                'Тестовое обращение в инфраструктурный блок со статусом "закрыто".',
                'telegram',
                '@student' || i,
                'closed',
                appeal_date::timestamp + (random() * interval '12 hours'),
                appeal_date::timestamp + interval '1 day',
                appeal_date::timestamp + interval '5 days'
            );
        ELSE
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                infrastructure_id,
                'Новая заявка - ' || i,
                'Тестовое обращение в инфраструктурный блок.',
                'email',
                'student' || i || '@example.com',
                'new',
                appeal_date::timestamp + (random() * interval '12 hours'),
                NULL,
                NULL
            );
        END IF;

        -- Стипендиальный комитет
        IF i % 3 = 1 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                scholarship_id,
                'Не пришла стипендия - ' || i,
                'Тестовое обращение в стипендиальный комитет. Вопрос о стипендии.',
                'email',
                'student' || i || '@example.com',
                'new',
                appeal_date::timestamp + (random() * interval '12 hours'),
                NULL,
                NULL
            );
        ELSIF i % 3 = 2 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                scholarship_id,
                'Вопрос о размере стипендии - ' || i,
                'Тестовое обращение в стипендиальный комитет со статусом "в работе".',
                'telegram',
                '@student' || i,
                'in_progress',
                appeal_date::timestamp + (random() * interval '12 hours'),
                appeal_date::timestamp + interval '4 hours',
                NULL
            );
        ELSE
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                scholarship_id,
                'Решённый вопрос по стипендии - ' || i,
                'Тестовое обращение в стипендиальный комитет со статусом "закрыто".',
                'email',
                'student' || i || '@example.com',
                'closed',
                appeal_date::timestamp + (random() * interval '12 hours'),
                appeal_date::timestamp + interval '1 day',
                appeal_date::timestamp + interval '4 days'
            );
        END IF;

        -- Иностранным студентам (реже)
        IF i % 7 = 1 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                international_id,
                'Вопрос по документам - ' || i,
                'Тестовое обращение в комитет для иностранных студентов.',
                'email',
                'student' || i || '@example.com',
                'new',
                appeal_date::timestamp + (random() * interval '12 hours'),
                NULL,
                NULL
            );
        ELSIF i % 7 = 2 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                international_id,
                'Адаптация - ' || i,
                'Тестовое обращение в комитет для иностранных студентов со статусом "закрыто".',
                'telegram',
                '@student' || i,
                'closed',
                appeal_date::timestamp + (random() * interval '12 hours'),
                appeal_date::timestamp + interval '2 days',
                appeal_date::timestamp + interval '6 days'
            );
        END IF;

        -- Другое (ещё реже)
        IF i % 10 = 1 THEN
            INSERT INTO appeals (direction_id, title, description, contact_type, contact_value, status, created_at, first_response_at, closed_at)
            VALUES (
                other_id,
                'Общий вопрос - ' || i,
                'Тестовое обращение в категорию "Другое".',
                'email',
                'student' || i || '@example.com',
                'new',
                appeal_date::timestamp + (random() * interval '12 hours'),
                NULL,
                NULL
            );
        END IF;
    END LOOP;

    RAISE NOTICE 'Создано тестовых обращений за последние 90 дней';
END $$;

-- Проверка результата
SELECT 
    d.title as direction,
    a.status,
    COUNT(*) as count
FROM appeals a
LEFT JOIN directions d ON a.direction_id = d.id
GROUP BY d.title, a.status
ORDER BY d.title, a.status;

