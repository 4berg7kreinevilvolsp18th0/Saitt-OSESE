-- ===============================
-- Миграция: Система хранения файлов с автоматическим удалением
-- ===============================

-- Проверяем, что таблица существует (если нет - создаем базовую структуру)
CREATE TABLE IF NOT EXISTS appeal_attachments (
    id uuid primary key default gen_random_uuid(),
    appeal_id uuid references appeals(id) on delete cascade,
    file_name text not null,
    file_url text not null,
    file_size integer,
    mime_type text,
    uploaded_at timestamptz default now()
);

-- Добавляем поля для управления хранением файлов
ALTER TABLE appeal_attachments 
ADD COLUMN IF NOT EXISTS keep_file boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS scheduled_deletion_at timestamptz,
ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
ADD COLUMN IF NOT EXISTS deletion_reason text;

-- Создаем индекс для быстрого поиска файлов, подлежащих удалению
CREATE INDEX IF NOT EXISTS idx_attachments_scheduled_deletion 
ON appeal_attachments(scheduled_deletion_at) 
WHERE scheduled_deletion_at IS NOT NULL AND deleted_at IS NULL;

-- Функция для автоматической установки времени удаления
CREATE OR REPLACE FUNCTION set_file_deletion_schedule()
RETURNS TRIGGER AS $$
BEGIN
  -- Если файл не помечен для сохранения, устанавливаем удаление через 24 часа
  IF NEW.keep_file = false THEN
    NEW.scheduled_deletion_at := NEW.uploaded_at + INTERVAL '24 hours';
  ELSE
    NEW.scheduled_deletion_at := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматической установки времени удаления
DROP TRIGGER IF EXISTS trigger_set_file_deletion ON appeal_attachments;
CREATE TRIGGER trigger_set_file_deletion
  BEFORE INSERT OR UPDATE ON appeal_attachments
  FOR EACH ROW
  EXECUTE FUNCTION set_file_deletion_schedule();

-- Функция для получения файлов, подлежащих удалению
CREATE OR REPLACE FUNCTION get_files_to_delete()
RETURNS TABLE (
  id uuid,
  appeal_id uuid,
  file_url text,
  file_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    aa.id,
    aa.appeal_id,
    aa.file_url,
    aa.file_name
  FROM appeal_attachments aa
  WHERE aa.scheduled_deletion_at IS NOT NULL
    AND aa.scheduled_deletion_at <= NOW()
    AND aa.deleted_at IS NULL
    AND aa.keep_file = false;
END;
$$ LANGUAGE plpgsql;

-- Комментарии к полям
COMMENT ON COLUMN appeal_attachments.keep_file IS 'Файл должен быть сохранен (не удаляться автоматически)';
COMMENT ON COLUMN appeal_attachments.reviewed_at IS 'Время, когда файл был просмотрен ответственным';
COMMENT ON COLUMN appeal_attachments.reviewed_by IS 'ID пользователя, который просмотрел файл';
COMMENT ON COLUMN appeal_attachments.scheduled_deletion_at IS 'Время запланированного удаления файла';
COMMENT ON COLUMN appeal_attachments.deleted_at IS 'Время фактического удаления файла';
COMMENT ON COLUMN appeal_attachments.deletion_reason IS 'Причина удаления файла';

