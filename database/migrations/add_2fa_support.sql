-- Таблица для хранения 2FA настроек пользователей
CREATE TABLE IF NOT EXISTS user_2fa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secret TEXT NOT NULL, -- TOTP секретный ключ
  enabled BOOLEAN DEFAULT FALSE, -- Включена ли 2FA
  backup_codes TEXT[], -- Резервные коды для восстановления
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_user_2fa_user_id ON user_2fa(user_id);
CREATE INDEX IF NOT EXISTS idx_user_2fa_enabled ON user_2fa(enabled);

-- RLS политики
ALTER TABLE user_2fa ENABLE ROW LEVEL SECURITY;

-- Пользователь может читать только свои данные
CREATE POLICY "user_2fa_select_own" ON user_2fa
  FOR SELECT USING (auth.uid() = user_id);

-- Пользователь может обновлять только свои данные
CREATE POLICY "user_2fa_update_own" ON user_2fa
  FOR UPDATE USING (auth.uid() = user_id);

-- Пользователь может вставлять только свои данные
CREATE POLICY "user_2fa_insert_own" ON user_2fa
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Админы могут читать все (для поддержки)
CREATE POLICY "user_2fa_select_admin" ON user_2fa
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND (user_roles.role = 'board' OR user_roles.role = 'staff')
    )
  );

-- Комментарии
COMMENT ON TABLE user_2fa IS 'Настройки двухфакторной аутентификации для пользователей';
COMMENT ON COLUMN user_2fa.secret IS 'TOTP секретный ключ (хранится в зашифрованном виде)';
COMMENT ON COLUMN user_2fa.backup_codes IS 'Резервные коды для восстановления доступа';
