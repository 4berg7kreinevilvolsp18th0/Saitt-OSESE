-- ===============================
-- Миграция: Защита контента от удаления
-- ===============================

-- Убеждаемся, что таблица content существует
CREATE TABLE IF NOT EXISTS content (
    id uuid primary key default gen_random_uuid(),
    type text not null check (type in ('news','guide','faq')),
    title text not null,
    slug text unique not null,
    body text not null,
    direction_id uuid references directions(id),
    status text not null default 'draft'
        check (status in ('draft','published','archived')),
    published_at timestamptz,
    updated_at timestamptz default now()
);

-- Добавляем soft delete для контента
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
ADD COLUMN IF NOT EXISTS deleted_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS deletion_reason text,
ADD COLUMN IF NOT EXISTS restore_token uuid DEFAULT gen_random_uuid();

-- Создаем таблицу для логирования действий с контентом
CREATE TABLE IF NOT EXISTS content_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete', 'restore', 'publish', 'unpublish')),
  user_id uuid REFERENCES auth.users(id),
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_content_audit_content_id ON content_audit_log(content_id);
CREATE INDEX IF NOT EXISTS idx_content_audit_user_id ON content_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_content_audit_action ON content_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_content_audit_created_at ON content_audit_log(created_at DESC);

-- Функция для логирования действий
CREATE OR REPLACE FUNCTION log_content_action()
RETURNS TRIGGER AS $$
DECLARE
  action_type text;
  old_json jsonb;
  new_json jsonb;
BEGIN
  -- Определяем тип действия
  IF TG_OP = 'INSERT' THEN
    action_type := 'create';
    old_json := NULL;
    new_json := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'update';
    old_json := to_jsonb(OLD);
    new_json := to_jsonb(NEW);
    
    -- Если это удаление (soft delete)
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
      action_type := 'delete';
    END IF;
    
    -- Если это восстановление
    IF NEW.deleted_at IS NULL AND OLD.deleted_at IS NOT NULL THEN
      action_type := 'restore';
    END IF;
    
    -- Если изменился статус на published
    IF NEW.status = 'published' AND OLD.status != 'published' THEN
      action_type := 'publish';
    END IF;
    
    -- Если изменился статус с published
    IF NEW.status != 'published' AND OLD.status = 'published' THEN
      action_type := 'unpublish';
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'delete';
    old_json := to_jsonb(OLD);
    new_json := NULL;
  END IF;

  -- Вставляем запись в лог
  INSERT INTO content_audit_log (
    content_id,
    action,
    user_id,
    old_data,
    new_data
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    action_type,
    COALESCE(NEW.deleted_by, OLD.deleted_by, (SELECT auth.uid())::uuid),
    old_json,
    new_json
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для логирования
DROP TRIGGER IF EXISTS trigger_content_audit ON content;
CREATE TRIGGER trigger_content_audit
  AFTER INSERT OR UPDATE OR DELETE ON content
  FOR EACH ROW
  EXECUTE FUNCTION log_content_action();

-- Функция для безопасного удаления (soft delete)
CREATE OR REPLACE FUNCTION safe_delete_content(
  content_id_param uuid,
  reason_param text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Получаем текущего пользователя с явным приведением типа
  current_user_id := (SELECT auth.uid())::uuid;
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Пользователь не авторизован';
  END IF;

  -- Выполняем soft delete
  UPDATE content
  SET 
    deleted_at = NOW(),
    deleted_by = current_user_id,
    deletion_reason = reason_param,
    status = 'archived' -- Меняем статус на архив
  WHERE id = content_id_param
    AND deleted_at IS NULL; -- Защита от повторного удаления

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для восстановления контента
CREATE OR REPLACE FUNCTION restore_content(
  content_id_param uuid,
  restore_token_param uuid
)
RETURNS boolean AS $$
BEGIN
  -- Проверяем токен восстановления
  UPDATE content
  SET 
    deleted_at = NULL,
    deleted_by = NULL,
    deletion_reason = NULL,
    restore_token = gen_random_uuid() -- Генерируем новый токен
  WHERE id = content_id_param
    AND restore_token = restore_token_param
    AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Обновляем представление для исключения удаленного контента
CREATE OR REPLACE VIEW content_published AS
SELECT *
FROM content
WHERE status = 'published'
  AND deleted_at IS NULL;

-- Комментарии
COMMENT ON COLUMN content.deleted_at IS 'Время soft delete (файл не удален физически)';
COMMENT ON COLUMN content.deleted_by IS 'ID пользователя, который удалил контент';
COMMENT ON COLUMN content.deletion_reason IS 'Причина удаления';
COMMENT ON COLUMN content.restore_token IS 'Токен для восстановления удаленного контента';
COMMENT ON TABLE content_audit_log IS 'Лог всех действий с контентом для аудита и восстановления';

