# Многослойная защита проекта ОСС ДВФУ

Комплексная стратегия безопасности для публичного проекта на GitHub с несколькими слоями защиты.

## 🎯 Принципы безопасности

1. **Defense in Depth** — несколько слоев защиты
2. **Zero Trust** — проверять все запросы
3. **Least Privilege** — минимальные необходимые права
4. **Security by Design** — безопасность с самого начала
5. **Public Code, Private Secrets** — код публичный, секреты защищены

---

## 🛡️ Слои защиты

### Слой 1: Защита на уровне сети (Network Layer)

#### 1.1 Cloudflare (CDN + WAF)

**Что это:**
- Content Delivery Network (CDN)
- Web Application Firewall (WAF)
- DDoS защита
- SSL/TLS автоматически

**Настройка:**
1. Зарегистрироваться на [Cloudflare](https://cloudflare.com) (бесплатно)
2. Добавить домен
3. Изменить DNS записи
4. Включить WAF (в бесплатном плане базовые правила)

**Плюсы:**
- Бесплатно
- Автоматическая защита от DDoS
- Кэширование (экономия трафика)
- Защита от ботов

**Настройка WAF правил:**
```javascript
// В Cloudflare Dashboard → Security → WAF
// Включить:
- SQL Injection Protection
- XSS Protection
- Rate Limiting (100 req/min per IP)
- Bot Fight Mode
```

#### 1.2 Vercel Edge Network

**Уже включено:**
- Автоматический SSL
- DDoS защита
- Географическое распределение

**Дополнительно:**
- Настроить Rate Limiting в `vercel.json`
- Включить Security Headers

---

### Слой 2: Защита на уровне приложения (Application Layer)

#### 2.1 Rate Limiting (уже реализовано)

**Backend (Python):**
```python
# backend/python/middleware.py
# Уже есть rate limiting через slowapi
```

**Frontend (Next.js):**
Добавить rate limiting для API routes:

```typescript
// lib/rateLimit.ts
import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  request: NextRequest,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 минута
): { success: boolean; remaining: number } {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }
  
  if (record.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }
  
  record.count++;
  return { success: true, remaining: maxRequests - record.count };
}

// Использование в API route:
export async function POST(request: NextRequest) {
  const limit = rateLimit(request, 10, 60000); // 10 запросов в минуту
  
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // ... остальной код
}
```

#### 2.2 Валидация входных данных

**Backend (Python + Pydantic):**
```python
# backend/python/schemas.py
from pydantic import BaseModel, validator, EmailStr
from typing import Optional
import re

class AppealCreate(BaseModel):
    title: str
    description: str
    contact_type: str
    contact_value: str
    
    @validator('title')
    def validate_title(cls, v):
        if len(v) < 5 or len(v) > 200:
            raise ValueError('Title must be 5-200 characters')
        # Защита от XSS
        if re.search(r'<script|javascript:|onerror=', v, re.IGNORECASE):
            raise ValueError('Invalid characters in title')
        return v
    
    @validator('description')
    def validate_description(cls, v):
        if len(v) < 10 or len(v) > 5000:
            raise ValueError('Description must be 10-5000 characters')
        return v
    
    @validator('contact_value')
    def validate_contact(cls, v, values):
        if values.get('contact_type') == 'email':
            # Простая валидация email
            if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
                raise ValueError('Invalid email format')
        elif values.get('contact_type') == 'telegram':
            if not re.match(r'^@?[a-zA-Z0-9_]{5,32}$', v):
                raise ValueError('Invalid Telegram username')
        return v
```

**Frontend (TypeScript + Zod):**
```typescript
// lib/validation.ts
import { z } from 'zod';

export const appealSchema = z.object({
  title: z.string()
    .min(5, 'Минимум 5 символов')
    .max(200, 'Максимум 200 символов')
    .refine(val => !/<script|javascript:|onerror=/i.test(val), {
      message: 'Недопустимые символы'
    }),
  description: z.string()
    .min(10, 'Минимум 10 символов')
    .max(5000, 'Максимум 5000 символов'),
  contact_type: z.enum(['email', 'telegram']),
  contact_value: z.string()
    .refine((val, ctx) => {
      if (ctx.parent.contact_type === 'email') {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
      }
      return /^@?[a-zA-Z0-9_]{5,32}$/.test(val);
    }, 'Неверный формат контакта')
});
```

#### 2.3 Защита от SQL Injection

**PostgreSQL (параметризованные запросы):**
```python
# ✅ ПРАВИЛЬНО
query = "SELECT * FROM appeals WHERE id = $1"
cursor.execute(query, [appeal_id])

# ❌ НЕПРАВИЛЬНО (уязвимо)
query = f"SELECT * FROM appeals WHERE id = '{appeal_id}'"
cursor.execute(query)
```

**Supabase (уже безопасно):**
- Supabase Client автоматически использует параметризованные запросы
- RLS (Row Level Security) защищает на уровне БД

#### 2.4 Защита от XSS

**Next.js (автоматически):**
- React автоматически экранирует HTML
- Но нужно быть осторожным с `dangerouslySetInnerHTML`

**Sanitization библиотека:**
```typescript
// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target']
  });
}
```

#### 2.5 CSRF защита

**Next.js API Routes:**
```typescript
// lib/csrf.ts
import { NextRequest } from 'next/server';
import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex');

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function validateCSRFToken(request: NextRequest, token: string): boolean {
  const headerToken = request.headers.get('x-csrf-token');
  return headerToken === token;
}

// Использование:
export async function POST(request: NextRequest) {
  const token = request.headers.get('x-csrf-token');
  if (!token || !validateCSRFToken(request, token)) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  // ... остальной код
}
```

---

### Слой 3: Защита на уровне базы данных (Database Layer)

#### 3.1 Row Level Security (RLS)

**Уже реализовано в Supabase:**
```sql
-- Пример из database/schema.sql
CREATE POLICY "appeals_members_read" ON appeals
  FOR SELECT USING (
    public.has_role('board') OR public.has_role('staff')
    OR (public.has_role('lead', direction_id) AND direction_id IS NOT NULL)
  );
```

**Для self-hosted PostgreSQL:**
```sql
-- Включить RLS
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;

-- Создать политики
CREATE POLICY "appeals_public_read" ON appeals
  FOR SELECT USING (status = 'published');
```

#### 3.2 Шифрование чувствительных данных

**В БД:**
```sql
-- Использовать pgcrypto для шифрования
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Хранить зашифрованные пароли (если будет своя аутентификация)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- bcrypt hash
  encrypted_data BYTEA -- для чувствительных данных
);
```

**В приложении:**
```python
# backend/python/encryption.py
from cryptography.fernet import Fernet
import os

class DataEncryption:
    def __init__(self):
        key = os.getenv('ENCRYPTION_KEY', Fernet.generate_key())
        self.cipher = Fernet(key)
    
    def encrypt(self, data: str) -> bytes:
        return self.cipher.encrypt(data.encode())
    
    def decrypt(self, encrypted: bytes) -> str:
        return self.cipher.decrypt(encrypted).decode()
```

---

### Слой 4: Аутентификация и авторизация

#### 4.1 Многофакторная аутентификация (MFA)

**Supabase Auth (уже поддерживает):**
- Email verification
- Phone verification
- TOTP (Time-based One-Time Password)

**Дополнительно:**
```typescript
// lib/mfa.ts
export async function enableMFA(userId: string) {
  // Интеграция с Supabase Auth MFA
  // Или собственная реализация через TOTP
}
```

#### 4.2 JWT токены с коротким временем жизни

**Настройка:**
```typescript
// lib/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 минут
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 дней

export function generateTokens(userId: string, role: string) {
  const accessToken = jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  
  return { accessToken, refreshToken };
}
```

#### 4.3 Роли и права доступа

**Уже реализовано:**
- Таблица `user_roles`
- Функция `has_role()`
- RLS политики

**Дополнительно:**
```sql
-- Аудит доступа
CREATE TABLE access_log (
  id UUID PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  resource TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Триггер для логирования
CREATE OR REPLACE FUNCTION log_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO access_log (user_id, action, resource, ip_address, user_agent)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### Слой 5: Мониторинг и логирование

#### 5.1 Логирование безопасности

**Backend (Python):**
```python
# backend/python/security_logger.py
import logging
from datetime import datetime
import json

security_logger = logging.getLogger('security')
security_logger.setLevel(logging.WARNING)

# Логировать в файл и в БД
def log_security_event(event_type: str, details: dict, user_id: str = None):
    event = {
        'timestamp': datetime.utcnow().isoformat(),
        'event_type': event_type,  # 'failed_login', 'rate_limit', 'sql_injection_attempt'
        'user_id': user_id,
        'details': details,
        'ip': details.get('ip'),
        'user_agent': details.get('user_agent')
    }
    
    security_logger.warning(json.dumps(event))
    
    # Также сохранить в БД
    # INSERT INTO security_log ...
```

**Frontend (TypeScript):**
```typescript
// lib/securityLogger.ts
export function logSecurityEvent(
  eventType: string,
  details: Record<string, any>
) {
  // Отправить на сервер для логирования
  fetch('/api/security/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType, details })
  }).catch(console.error);
}
```

#### 5.2 Алерты при подозрительной активности

**Настройка:**
```python
# backend/python/security_alerts.py
from typing import List
import smtplib
from email.mime.text import MIMEText

def check_suspicious_activity(user_id: str, ip: str) -> List[str]:
    alerts = []
    
    # Проверить частые неудачные попытки входа
    failed_attempts = count_failed_logins(user_id, ip, minutes=5)
    if failed_attempts > 5:
        alerts.append('multiple_failed_logins')
    
    # Проверить необычную активность
    if is_unusual_location(ip):
        alerts.append('unusual_location')
    
    # Проверить SQL injection попытки
    if detect_sql_injection_attempt(ip):
        alerts.append('sql_injection_attempt')
    
    return alerts

def send_security_alert(alert_type: str, details: dict):
    # Отправить email администратору
    # Или в Telegram бот
    # Или в систему мониторинга
    pass
```

---

### Слой 6: Защита секретов (Secrets Management)

#### 6.1 Environment Variables

**Никогда не коммитить секреты в Git:**
```bash
# .gitignore (уже есть)
.env
.env.local
.env.production
*.key
*.pem
secrets/
```

**Использовать переменные окружения:**
```typescript
// ✅ ПРАВИЛЬНО
const apiKey = process.env.API_KEY;

// ❌ НЕПРАВИЛЬНО
const apiKey = 'hardcoded-secret-key';
```

#### 6.2 GitHub Secrets

**Для CI/CD:**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: |
          # Деплой
```

**Настройка:**
1. GitHub → Settings → Secrets and variables → Actions
2. Добавить все секреты
3. Использовать в workflows через `${{ secrets.NAME }}`

#### 6.3 Vercel Environment Variables

**Уже настроено:**
- Все секреты хранятся в Vercel
- Не попадают в код

**Дополнительно:**
- Использовать разные значения для Production/Preview
- Регулярно ротировать ключи

---

### Слой 7: Дополнительные сервисы безопасности

#### 7.1 Sentry (отслеживание ошибок)

**Установка:**
```bash
npm install @sentry/nextjs
```

**Настройка:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% запросов
  beforeSend(event, hint) {
    // Не логировать секреты
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
    }
    return event;
  }
});
```

#### 7.2 Security Headers

**next.config.js:**
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};
```

#### 7.3 Защита от ботов

**Cloudflare Bot Fight Mode:**
- Включить в Cloudflare Dashboard
- Автоматически блокирует ботов

**Дополнительно (reCAPTCHA):**
```typescript
// lib/recaptcha.ts
export async function verifyRecaptcha(token: string): Promise<boolean> {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
  });
  
  const data = await response.json();
  return data.success;
}
```

---

### Слой 8: Резервное копирование и восстановление

#### 8.1 Автоматические бэкапы

**PostgreSQL:**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="oss_dvfu"

# Создать бэкап
pg_dump -U oss_user -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Сжать
gzip $BACKUP_DIR/backup_$DATE.sql

# Удалить старые (старше 30 дней)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Загрузить в облако (опционально)
# aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://backups/
```

**Cron:**
```bash
# Ежедневно в 2:00
0 2 * * * /path/to/backup.sh
```

#### 8.2 Тестирование восстановления

**Регулярно проверять:**
- Восстановление из бэкапа
- Целостность данных
- Время восстановления

---

## 🔧 Реализация

### Приоритет 1: Немедленно

1. **Настроить Security Headers** в `next.config.js`
2. **Добавить Rate Limiting** для API routes
3. **Улучшить валидацию** входных данных
4. **Настроить Cloudflare** (если есть домен)

### Приоритет 2: В первые недели

1. **Добавить логирование безопасности**
2. **Настроить Sentry** для отслеживания ошибок
3. **Улучшить CSRF защиту**
4. **Настроить автоматические бэкапы**

### Приоритет 3: Долгосрочно

1. **Реализовать MFA**
2. **Добавить мониторинг подозрительной активности**
3. **Настроить алерты**
4. **Провести security audit**

---

## 📋 Чеклист безопасности

### Код:
- [ ] Все секреты в environment variables
- [ ] Нет hardcoded паролей/ключей
- [ ] Валидация всех входных данных
- [ ] Параметризованные SQL запросы
- [ ] XSS защита (sanitization)
- [ ] CSRF токены
- [ ] Rate limiting

### Инфраструктура:
- [ ] SSL/TLS включен
- [ ] Security Headers настроены
- [ ] WAF (Cloudflare) включен
- [ ] DDoS защита
- [ ] Firewall настроен

### База данных:
- [ ] RLS включен
- [ ] Минимальные права доступа
- [ ] Шифрование чувствительных данных
- [ ] Регулярные бэкапы

### Мониторинг:
- [ ] Логирование безопасности
- [ ] Алерты при подозрительной активности
- [ ] Отслеживание ошибок (Sentry)
- [ ] Мониторинг использования

---

## 🚨 Что делать при инциденте

1. **Немедленно:**
   - Заблокировать подозрительные IP
   - Изменить скомпрометированные ключи
   - Проверить логи

2. **Краткосрочно:**
   - Уведомить пользователей (если нужно)
   - Провести анализ инцидента
   - Усилить защиту

3. **Долгосрочно:**
   - Обновить политики безопасности
   - Провести security audit
   - Улучшить мониторинг

---

## 📚 Полезные ресурсы

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [Cloudflare Security](https://www.cloudflare.com/learning/security/)

---

**Итог:** Многослойная защита обеспечивает безопасность проекта даже при публичном коде. Главное — правильно управлять секретами и мониторить активность.

