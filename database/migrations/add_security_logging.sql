-- Таблица для логирования безопасности
-- Включает попытки входа, регистрации, подозрительную активность

CREATE TABLE IF NOT EXISTS security_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'login_attempt', 'registration', 'blocked_ip', 'suspicious_activity'
  email TEXT, -- Частично скрытый email (первые 3 символа + ***)
  status TEXT NOT NULL, -- 'success', 'failed', 'blocked', 'attempt'
  details TEXT, -- Дополнительная информация об ошибке
  ip_address INET,
  user_agent TEXT,
  metadata JSONB, -- Дополнительные данные (роль, направление и т.д.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_security_log_event_type ON security_log(event_type);
CREATE INDEX IF NOT EXISTS idx_security_log_status ON security_log(status);
CREATE INDEX IF NOT EXISTS idx_security_log_ip ON security_log(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_log_created_at ON security_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_log_email ON security_log(email);

-- Индекс для поиска по IP и времени (для обнаружения атак)
CREATE INDEX IF NOT EXISTS idx_security_log_ip_time ON security_log(ip_address, created_at DESC);

-- RLS политики (только админы могут читать логи)
ALTER TABLE security_log ENABLE ROW LEVEL SECURITY;

-- Только board и staff могут читать логи
CREATE POLICY "security_log_read" ON security_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND (user_roles.role = 'board' OR user_roles.role = 'staff')
    )
  );

-- Публичная вставка (для логирования попыток входа)
CREATE POLICY "security_log_insert" ON security_log
  FOR INSERT WITH CHECK (true);

-- Функция для автоматической очистки старых логов (старше 90 дней)
CREATE OR REPLACE FUNCTION cleanup_old_security_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM security_log
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Комментарии
COMMENT ON TABLE security_log IS 'Логи безопасности: попытки входа, регистрации, подозрительная активность';
COMMENT ON COLUMN security_log.email IS 'Частично скрытый email для приватности';
COMMENT ON COLUMN security_log.metadata IS 'Дополнительные данные в формате JSON';

