# Реализованные системы безопасности

Документация по реализованным системам безопасности: Redis rate limiting, CAPTCHA, 2FA, CSP.

## 🔴 1. Redis для Rate Limiting

### Реализация

**Файл:** `frontend/nextjs/lib/redis.ts`

**Особенности:**
- Поддержка Upstash Redis (бесплатный tier, HTTP-based, работает на Edge)
- Поддержка обычного Redis (через ioredis)
- Fallback на in-memory хранилище для разработки
- Sliding window log algorithm для точного rate limiting

**Использование:**
```typescript
import { checkRateLimitRedis } from './lib/redis';

const limit = await checkRateLimitRedis(
  `login:${ip}:${email}`,
  5, // max requests
  60 // window in seconds
);
```

### Настройка

**Upstash Redis (рекомендуется):**
1. Зарегистрироваться на [upstash.com](https://upstash.com)
2. Создать Redis database
3. Скопировать REST URL и Token
4. Добавить в Vercel Environment Variables:
   ```
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

**Обычный Redis:**
```
REDIS_URL=redis://user:password@host:port
```

### Интеграция

- ✅ `middleware.ts` - использует Redis для rate limiting
- ✅ `/api/auth/rate-limit` - серверная проверка rate limit
- ✅ Блокировка IP адресов

---

## 🟡 2. CAPTCHA (Google reCAPTCHA v3)

### Реализация

**Файлы:**
- `frontend/nextjs/lib/captcha.ts` - клиентская логика
- `frontend/nextjs/app/api/auth/verify-captcha/route.ts` - серверная верификация

**Особенности:**
- reCAPTCHA v3 (невидимая, работает в фоне)
- Автоматическая загрузка скрипта
- Проверка score (0.0 - 1.0, порог 0.5)
- Интегрирована в формы входа и регистрации

**Использование:**
```typescript
import { getRecaptchaToken, verifyRecaptchaToken } from './lib/captcha';

// Получить токен
const token = await getRecaptchaToken('login');

// Верифицировать на сервере
const isValid = await verifyRecaptchaToken(token);
```

### Настройка

1. Зарегистрироваться на [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
2. Создать сайт (reCAPTCHA v3)
3. Получить Site Key и Secret Key
4. Добавить в Vercel Environment Variables:
   ```
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le...
   RECAPTCHA_SECRET_KEY=6Le...
   ```

### Интеграция

- ✅ `/login` - проверка CAPTCHA перед входом
- ✅ `/register` - проверка CAPTCHA перед регистрацией
- ✅ Автоматическая загрузка скрипта
- ✅ Обработка ошибок

---

## 🟢 3. 2FA (Two-Factor Authentication)

### Реализация

**Файлы:**
- `frontend/nextjs/lib/2fa.ts` - утилиты для 2FA
- `frontend/nextjs/app/api/auth/2fa/setup/route.ts` - настройка 2FA
- `frontend/nextjs/app/api/auth/2fa/verify/route.ts` - верификация и включение
- `frontend/nextjs/app/api/auth/2fa/check/route.ts` - проверка при входе
- `frontend/nextjs/app/admin/settings/2fa/page.tsx` - страница настройки
- `frontend/nextjs/app/login/2fa/page.tsx` - страница ввода кода при входе

**Особенности:**
- TOTP (Time-based One-Time Password)
- Генерация QR кодов для приложений-аутентификаторов
- Резервные коды для восстановления
- Интеграция в процесс входа

**Использование:**
```typescript
import { generate2FASecret, verify2FAToken } from './lib/2fa';

// Генерация секрета
const secret = generate2FASecret();

// Верификация токена
const isValid = verify2FAToken(token, secret);
```

### Настройка

1. Применить миграцию БД:
   ```sql
   -- database/migrations/add_2fa_support.sql
   ```

2. Установить зависимости:
   ```bash
   npm install otplib qrcode
   ```

3. Настроить страницу настроек:
   - Доступна по `/admin/settings/2fa`
   - Только для авторизованных пользователей

### Процесс настройки

1. Пользователь заходит в `/admin/settings/2fa`
2. Нажимает "Начать настройку"
3. Получает QR код
4. Сканирует QR код в приложении (Google Authenticator, Authy и т.д.)
5. Вводит код из приложения для подтверждения
6. Получает резервные коды для сохранения

### Процесс входа с 2FA

1. Пользователь вводит email и пароль
2. Если 2FA включена, перенаправляется на `/login/2fa`
3. Вводит 6-значный код из приложения
4. После успешной верификации - вход в систему

---

## 🔵 4. CSP (Content Security Policy)

### Реализация

**Файл:** `frontend/nextjs/middleware.ts`

**Политика:**
```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com data:
img-src 'self' data: https: blob:
connect-src 'self' https://*.supabase.co https://api.ipify.org https://www.google.com
frame-src 'self' https://www.google.com
object-src 'none'
base-uri 'self'
form-action 'self'
frame-ancestors 'none'
upgrade-insecure-requests
```

**Особенности:**
- Защита от XSS атак
- Разрешение только необходимых источников
- Поддержка reCAPTCHA (Google domains)
- Поддержка Supabase
- Блокировка inline scripts (кроме необходимых)

### Настройка

CSP автоматически применяется через middleware. При необходимости можно настроить в `middleware.ts`.

---

## 📋 Чеклист настройки

### 1. Redis (Rate Limiting)

- [ ] Зарегистрироваться на Upstash
- [ ] Создать Redis database
- [ ] Добавить `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN` в Vercel
- [ ] Проверить работу rate limiting

### 2. CAPTCHA

- [ ] Зарегистрироваться на Google reCAPTCHA
- [ ] Создать сайт (v3)
- [ ] Добавить `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` и `RECAPTCHA_SECRET_KEY` в Vercel
- [ ] Проверить работу на формах входа/регистрации

### 3. 2FA

- [ ] Применить миграцию `add_2fa_support.sql`
- [ ] Установить `npm install otplib qrcode`
- [ ] Проверить страницу `/admin/settings/2fa`
- [ ] Протестировать настройку и вход с 2FA

### 4. CSP

- [ ] Проверить, что CSP headers применяются (DevTools → Network)
- [ ] Убедиться, что сайт работает корректно
- [ ] При необходимости скорректировать политику в `middleware.ts`

---

## 🚀 Production готовность

### Обязательно:

1. ✅ Redis настроен (Upstash или собственный)
2. ✅ CAPTCHA настроена
3. ✅ 2FA миграция применена
4. ✅ CSP работает

### Рекомендуется:

1. Мониторинг rate limiting (логирование блокировок)
2. Резервное копирование 2FA секретов
3. Уведомления при включении/отключении 2FA
4. Аналитика CAPTCHA score

---

## 📚 Полезные ссылки

- [Upstash Redis](https://upstash.com)
- [Google reCAPTCHA](https://www.google.com/recaptcha)
- [TOTP RFC 6238](https://tools.ietf.org/html/rfc6238)
- [CSP MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Итог:** Все 4 системы безопасности реализованы и готовы к использованию. Следуйте чеклисту для настройки в production.

