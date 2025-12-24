-- ===============================
-- Миграция: Улучшение анонимности обращений
-- ===============================

-- Добавляем поле для хранения зашифрованных контактов
ALTER TABLE appeals 
ADD COLUMN IF NOT EXISTS encrypted_contact_value text,
ADD COLUMN IF NOT EXISTS contact_hash text; -- Хеш для поиска дубликатов без раскрытия контакта

-- Создаем функцию для генерации хеша контакта (для поиска дубликатов)
CREATE OR REPLACE FUNCTION generate_contact_hash(contact_value text)
RETURNS text AS $$
BEGIN
  -- Используем SHA256 для создания хеша
  -- Это позволяет искать дубликаты без раскрытия контакта
  RETURN encode(digest(contact_value, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Функция для скрытия контакта в анонимных обращениях
CREATE OR REPLACE FUNCTION mask_contact(contact_value text, is_anonymous boolean)
RETURNS text AS $$
BEGIN
  IF is_anonymous THEN
    -- Для email: показываем только домен
    IF contact_value LIKE '%@%' THEN
      RETURN '***@' || substring(contact_value from '@(.+)$');
    -- Для телеграма: показываем только часть
    ELSIF contact_value LIKE '@%' OR contact_value LIKE 't.me/%' THEN
      RETURN '***' || substring(contact_value from '(@|t.me/)(.+)$');
    ELSE
      RETURN '***';
    END IF;
  ELSE
    RETURN contact_value;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Создаем представление для безопасного просмотра обращений
CREATE OR REPLACE VIEW appeals_safe AS
SELECT 
  id,
  direction_id,
  category,
  title,
  description,
  institute,
  is_anonymous,
  contact_type,
  -- Скрываем контакт для анонимных обращений
  CASE 
    WHEN is_anonymous THEN mask_contact(contact_value, true)
    ELSE contact_value
  END AS contact_value,
  status,
  public_token,
  deadline,
  assigned_to,
  priority,
  tags,
  created_at,
  first_response_at,
  closed_at
FROM appeals;

-- Комментарии
COMMENT ON COLUMN appeals.encrypted_contact_value IS 'Зашифрованное значение контакта (для будущего использования)';
COMMENT ON COLUMN appeals.contact_hash IS 'SHA256 хеш контакта для поиска дубликатов без раскрытия';
COMMENT ON VIEW appeals_safe IS 'Безопасное представление обращений с маскировкой анонимных контактов';

-- Обновляем существующие записи: генерируем хеши для контактов
UPDATE appeals 
SET contact_hash = generate_contact_hash(contact_value)
WHERE contact_value IS NOT NULL AND contact_hash IS NULL;

