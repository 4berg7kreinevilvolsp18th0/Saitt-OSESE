-- Миграция: Добавление Telegram уведомлений и новых типов уведомлений
-- Дата: 2024
-- Описание: Добавляет поддержку Telegram уведомлений для админов и новые типы событий

-- Добавляем новые колонки в notification_settings
ALTER TABLE notification_settings 
  ADD COLUMN IF NOT EXISTS email_appeal_new boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_appeal_overdue boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_appeal_escalated boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS push_appeal_new boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS push_appeal_overdue boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS push_appeal_escalated boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS telegram_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS telegram_chat_id text,
  ADD COLUMN IF NOT EXISTS telegram_username text,
  ADD COLUMN IF NOT EXISTS telegram_appeal_status boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS telegram_appeal_assigned boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS telegram_appeal_comment boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS telegram_appeal_new boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS telegram_appeal_overdue boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS telegram_appeal_escalated boolean DEFAULT true;

-- Обновляем check constraint для notification_log.type
ALTER TABLE notification_log 
  DROP CONSTRAINT IF EXISTS notification_log_type_check;

ALTER TABLE notification_log 
  ADD CONSTRAINT notification_log_type_check 
  CHECK (type IN ('email', 'push', 'telegram'));

-- Обновляем check constraint для notification_log.event_type
ALTER TABLE notification_log 
  DROP CONSTRAINT IF EXISTS notification_log_event_type_check;

ALTER TABLE notification_log 
  ADD CONSTRAINT notification_log_event_type_check 
  CHECK (event_type IN ('appeal_status', 'appeal_assigned', 'appeal_comment', 'appeal_new', 'appeal_overdue', 'appeal_escalated', 'daily_summary'));

-- Комментарии к новым колонкам
COMMENT ON COLUMN notification_settings.email_appeal_new IS 'Уведомления о новых обращениях в направлении';
COMMENT ON COLUMN notification_settings.email_appeal_overdue IS 'Уведомления о просроченных обращениях';
COMMENT ON COLUMN notification_settings.email_appeal_escalated IS 'Уведомления об эскалации обращений';
COMMENT ON COLUMN notification_settings.telegram_enabled IS 'Включены ли Telegram уведомления';
COMMENT ON COLUMN notification_settings.telegram_chat_id IS 'Telegram chat_id пользователя (получается через бота)';
COMMENT ON COLUMN notification_settings.telegram_username IS 'Telegram username для удобства';

