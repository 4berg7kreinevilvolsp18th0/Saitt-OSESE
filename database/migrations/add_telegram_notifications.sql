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
