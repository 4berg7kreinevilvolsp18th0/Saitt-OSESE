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

