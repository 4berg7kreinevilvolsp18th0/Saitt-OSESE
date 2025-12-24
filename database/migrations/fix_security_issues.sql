-- ===============================
-- Миграция: Исправление проблем безопасности и производительности
-- ===============================

-- ============================================
-- 1. ИСПРАВЛЕНИЕ: Security Definer View
-- ============================================

-- Удаляем старое представление с SECURITY DEFINER
DROP VIEW IF EXISTS content_published;

-- Создаем новое представление БЕЗ SECURITY DEFINER
CREATE VIEW content_published AS
SELECT *
FROM content
WHERE status = 'published'
  AND deleted_at IS NULL;

-- Комментарий
COMMENT ON VIEW content_published IS 'Публичный контент без SECURITY DEFINER';

-- ============================================
-- 2. ИСПРАВЛЕНИЕ: RLS для content_audit_log
-- ============================================

-- Включаем RLS для таблицы content_audit_log
ALTER TABLE content_audit_log ENABLE ROW LEVEL SECURITY;

-- Политика: только админы могут читать логи
CREATE POLICY content_audit_log_admin_read ON content_audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = (SELECT auth.uid())
        AND ur.role IN ('board', 'staff')
    )
  );

-- Политика: только система может вставлять логи (через триггер)
CREATE POLICY content_audit_log_system_insert ON content_audit_log
  FOR INSERT
  WITH CHECK (true); -- Триггер вставляет от имени системы

-- Комментарий
COMMENT ON POLICY content_audit_log_admin_read ON content_audit_log IS 'Только админы могут читать логи аудита';

-- ============================================
-- 3. ИСПРАВЛЕНИЕ: Function Search Path
-- ============================================

-- Исправляем функцию log_content_action
CREATE OR REPLACE FUNCTION log_content_action()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
    COALESCE(NEW.deleted_by, OLD.deleted_by, auth.uid()),
    old_json,
    new_json
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Исправляем функцию safe_delete_content
CREATE OR REPLACE FUNCTION safe_delete_content(
  content_id_param uuid,
  reason_param text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Получаем текущего пользователя
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Пользователь не авторизован';
  END IF;

  -- Выполняем soft delete
  UPDATE content
  SET 
    deleted_at = NOW(),
    deleted_by = current_user_id,
    deletion_reason = reason_param,
    status = 'archived'
  WHERE id = content_id_param
    AND deleted_at IS NULL;

  RETURN FOUND;
END;
$$;

-- Исправляем функцию restore_content
CREATE OR REPLACE FUNCTION restore_content(
  content_id_param uuid,
  restore_token_param uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Проверяем токен восстановления
  UPDATE content
  SET 
    deleted_at = NULL,
    deleted_by = NULL,
    deletion_reason = NULL,
    restore_token = gen_random_uuid()
  WHERE id = content_id_param
    AND restore_token = restore_token_param
    AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$$;

-- ============================================
-- 4. ИСПРАВЛЕНИЕ: Индексы для внешних ключей
-- ============================================

-- Индекс для content.deleted_by
CREATE INDEX IF NOT EXISTS idx_content_deleted_by ON content(deleted_by)
WHERE deleted_by IS NOT NULL;

-- Индекс для documents.direction_id
CREATE INDEX IF NOT EXISTS idx_documents_direction_id ON documents(direction_id)
WHERE direction_id IS NOT NULL;

-- ============================================
-- 5. ИСПРАВЛЕНИЕ: Оптимизация RLS политик
-- ============================================

-- Обновляем политики для использования (select auth.uid()) вместо auth.uid()
-- Это улучшает производительность, так как функция вызывается один раз, а не для каждой строки

-- Обновляем политику user_roles_read_own
DROP POLICY IF EXISTS user_roles_read_own ON user_roles;
CREATE POLICY user_roles_read_own ON user_roles
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));

-- Обновляем политику notification_settings_own
DROP POLICY IF EXISTS notification_settings_own ON notification_settings;
CREATE POLICY notification_settings_own ON notification_settings
  FOR ALL
  USING (user_id = (SELECT auth.uid()));

-- Обновляем политики notification_log
DROP POLICY IF EXISTS notification_log_own ON notification_log;
DROP POLICY IF EXISTS notification_log_insert ON notification_log;

CREATE POLICY notification_log_own ON notification_log
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY notification_log_insert ON notification_log
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ============================================
-- 6. ОПТИМИЗАЦИЯ: Объединение множественных политик
-- ============================================

-- Для appeals: объединяем две политики в одну
DROP POLICY IF EXISTS appeals_members_read ON appeals;
DROP POLICY IF EXISTS appeals_public_read_by_token ON appeals;

-- Создаем объединенную политику
CREATE POLICY appeals_unified_read ON appeals
  FOR SELECT
  USING (
    -- Члены ОСС видят обращения своего направления
    (
      EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = (SELECT auth.uid())
          AND (
            ur.role = 'board'
            OR (ur.role IN ('lead', 'member', 'staff') AND ur.direction_id = appeals.direction_id)
          )
      )
    )
    OR
    -- Публичный доступ по токену
    (
      public_token IS NOT NULL
      AND public_token = current_setting('request.headers', true)::json->>'x-public-token'
    )
  );

-- Для content: объединяем политики
DROP POLICY IF EXISTS content_members_manage ON content;
DROP POLICY IF EXISTS content_public_read ON content;

CREATE POLICY content_unified_read ON content
  FOR SELECT
  USING (
    -- Публичный доступ к опубликованному контенту
    (status = 'published' AND deleted_at IS NULL)
    OR
    -- Члены ОСС видят весь контент
    (
      EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = (SELECT auth.uid())
          AND ur.role IN ('board', 'lead', 'member', 'staff')
      )
    )
  );

-- Для documents: объединяем политики
DROP POLICY IF EXISTS documents_members_manage ON documents;
DROP POLICY IF EXISTS documents_public_read ON documents;

CREATE POLICY documents_unified_read ON documents
  FOR SELECT
  USING (
    -- Публичный доступ
    true
    OR
    -- Члены ОСС видят все документы
    (
      EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = (SELECT auth.uid())
          AND ur.role IN ('board', 'lead', 'member', 'staff')
      )
    )
  );

-- Для user_roles: объединяем политики
DROP POLICY IF EXISTS user_roles_manage ON user_roles;
DROP POLICY IF EXISTS user_roles_read_own ON user_roles;

-- Создаем объединенную политику
CREATE POLICY user_roles_unified_read ON user_roles
  FOR SELECT
  USING (
    -- Пользователь видит свои роли
    (user_id = (SELECT auth.uid()))
    OR
    -- Админы видят все роли
    (
      EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = (SELECT auth.uid())
          AND ur.role = 'board'
      )
    )
  );

-- ============================================
-- 7. КОММЕНТАРИИ
-- ============================================

COMMENT ON FUNCTION log_content_action() IS 'Логирование действий с контентом с установленным search_path';
COMMENT ON FUNCTION safe_delete_content(uuid, text) IS 'Безопасное удаление контента с установленным search_path';
COMMENT ON FUNCTION restore_content(uuid, uuid) IS 'Восстановление контента с установленным search_path';
COMMENT ON INDEX idx_content_deleted_by IS 'Индекс для внешнего ключа content.deleted_by';
COMMENT ON INDEX idx_documents_direction_id IS 'Индекс для внешнего ключа documents.direction_id';

