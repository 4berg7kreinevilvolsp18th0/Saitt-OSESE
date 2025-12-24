-- ===============================
-- Миграция: Исправление ошибок типов UUID
-- ===============================
-- 
-- Исправляет ошибки "operator does not exist: uuid = text"
-- Добавляет явное приведение типов для auth.uid()
--

-- ============================================
-- 1. Исправление функций с auth.uid()
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
  current_user_uuid uuid;
BEGIN
  -- Получаем UUID пользователя с явным приведением типа
  current_user_uuid := (SELECT auth.uid())::uuid;
  
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
    COALESCE(NEW.deleted_by, OLD.deleted_by, current_user_uuid),
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
    status = 'archived'
  WHERE id = content_id_param
    AND deleted_at IS NULL;

  RETURN FOUND;
END;
$$;

-- ============================================
-- 2. Исправление RLS политик для user_2fa
-- ============================================

DROP POLICY IF EXISTS "user_2fa_select_own" ON user_2fa;
DROP POLICY IF EXISTS "user_2fa_update_own" ON user_2fa;
DROP POLICY IF EXISTS "user_2fa_insert_own" ON user_2fa;
DROP POLICY IF EXISTS "user_2fa_select_admin" ON user_2fa;

-- Пользователь может читать только свои данные
CREATE POLICY "user_2fa_select_own" ON user_2fa
  FOR SELECT USING ((SELECT auth.uid())::uuid = user_id);

-- Пользователь может обновлять только свои данные
CREATE POLICY "user_2fa_update_own" ON user_2fa
  FOR UPDATE USING ((SELECT auth.uid())::uuid = user_id);

-- Пользователь может вставлять только свои данные
CREATE POLICY "user_2fa_insert_own" ON user_2fa
  FOR INSERT WITH CHECK ((SELECT auth.uid())::uuid = user_id);

-- Админы могут читать все (для поддержки)
CREATE POLICY "user_2fa_select_admin" ON user_2fa
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (SELECT auth.uid())::uuid
        AND (user_roles.role = 'board' OR user_roles.role = 'staff')
    )
  );

-- ============================================
-- 3. Исправление RLS политик для security_log
-- ============================================

DROP POLICY IF EXISTS "security_log_read" ON security_log;

CREATE POLICY "security_log_read" ON security_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (SELECT auth.uid())::uuid
        AND (user_roles.role = 'board' OR user_roles.role = 'staff')
    )
  );

-- ============================================
-- 4. Исправление RLS политик в schema.sql (если они есть)
-- ============================================

-- Исправляем политики user_roles, если они используют auth.uid() напрямую
DROP POLICY IF EXISTS "user_roles_read_own" ON user_roles;

CREATE POLICY "user_roles_read_own" ON user_roles
  FOR SELECT
  USING (user_id = (SELECT auth.uid())::uuid);

-- ============================================
-- 5. Исправление функции has_role (если используется)
-- ============================================

-- Обновляем функцию has_role для правильной работы с UUID
CREATE OR REPLACE FUNCTION has_role(
  p_role text,
  p_direction_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
  if p_direction_id is null then
    -- Check if user has role without direction (board/staff)
    return exists (
      select 1 from user_roles
      where user_id = (SELECT auth.uid())::uuid
        and role = p_role
        and direction_id is null
    );
  else
    -- Check if user has role for specific direction
    return exists (
      select 1 from user_roles
      where user_id = (SELECT auth.uid())::uuid
        and role = p_role
        and (direction_id = p_direction_id or direction_id is null)
    );
  end if;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Комментарии
COMMENT ON FUNCTION log_content_action() IS 'Логирование действий с контентом с исправленными типами UUID';
COMMENT ON FUNCTION safe_delete_content(uuid, text) IS 'Безопасное удаление контента с исправленными типами UUID';
COMMENT ON FUNCTION has_role(text, uuid) IS 'Проверка роли пользователя с исправленными типами UUID';

