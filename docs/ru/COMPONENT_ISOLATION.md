# Изоляция компонентов и отказоустойчивость

## 🎯 Принцип безопасности

**Главное правило:** При атаке на один компонент все остальные компоненты продолжают работать независимо.

Система спроектирована так, чтобы продолжать функционировать даже при недоступности или атаке на отдельные компоненты.

---

## 🏗️ Архитектура изоляции

### Компоненты системы

1. **Database** (PostgreSQL/Supabase) - критический
2. **Redis** - важный (кэш, rate limiting)
3. **Email** - некритичный (уведомления)
4. **Telegram** - некритичный (уведомления)
5. **CAPTCHA** - важный (защита от ботов)
6. **2FA** - важный (двухфакторная аутентификация)
7. **File Upload** - важный (загрузка файлов)
8. **Notifications** - некритичный (уведомления)
9. **Analytics** - некритичный (аналитика)

### Классификация компонентов

- **Критические:** Без них система не может работать (Database)
- **Важные:** Система работает, но с ограничениями (Redis, CAPTCHA, 2FA)
- **Некритичные:** Система работает полностью, но без дополнительных функций (Email, Telegram, Analytics)

---

## 🔄 Circuit Breaker Pattern

### Как работает

Circuit Breaker имеет 3 состояния:

1. **CLOSED** (Закрыт) - нормальная работа
   - Все запросы проходят
   - Ошибки отслеживаются

2. **OPEN** (Открыт) - компонент недоступен
   - Запросы не выполняются
   - Сразу возвращается fallback
   - Периодически проверяется восстановление

3. **HALF_OPEN** (Полуоткрыт) - тестирование восстановления
   - Разрешается ограниченное количество запросов
   - При успехе → CLOSED
   - При ошибке → OPEN

### Конфигурация

```typescript
{
  failureThreshold: 5,      // 5 ошибок подряд
  resetTimeout: 60000,      // 60 секунд до попытки восстановления
  successThreshold: 2,      // 2 успешных запроса для закрытия
  timeout: 10000,           // 10 секунд таймаут запроса
}
```

---

## 🛡️ Реализация

### 1. Circuit Breaker (`lib/circuitBreaker.ts`)

```typescript
import { executeWithCircuitBreaker } from './lib/circuitBreaker';

// Выполнить операцию с Circuit Breaker
const result = await executeWithCircuitBreaker(
  'database',
  async () => {
    // Операция с базой данных
    return await supabase.from('appeals').select();
  },
  () => {
    // Fallback при недоступности
    return { data: [], error: null };
  }
);
```

### 2. Изоляция компонентов (`lib/componentIsolation.ts`)

```typescript
import { safeDatabaseOperation, safeEmailSend } from './lib/componentIsolation';

// Безопасная операция с базой данных
const data = await safeDatabaseOperation(
  async () => await supabase.from('appeals').select(),
  () => [] // Fallback
);

// Безопасная отправка email
const sent = await safeEmailSend(
  async () => await sendEmail(...),
  () => false // Fallback: не отправлено, но система работает
);
```

---

## 📊 Примеры использования

### Email уведомления

```typescript
// app/api/notifications/email/route.ts
import { safeEmailSend } from '../../../lib/componentIsolation';

const emailSent = await safeEmailSend(
  async () => {
    const response = await fetch('https://api.resend.com/emails', {...});
    if (!response.ok) throw new Error('Email service error');
    return true;
  },
  () => {
    // Fallback: email не отправлен, но обращение обработано
    console.warn('Email service unavailable, но обращение обработано');
    return false;
  }
);
```

**Результат:** Если email сервис атакован или недоступен, обращение все равно обрабатывается, просто без email уведомления.

### Telegram уведомления

```typescript
// app/api/notifications/telegram/route.ts
import { safeTelegramSend } from '../../../lib/componentIsolation';

const telegramSent = await safeTelegramSend(
  async () => {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {...});
    if (!response.ok) throw new Error('Telegram API error');
    return true;
  },
  () => {
    // Fallback: telegram не отправлен, но обращение обработано
    return false;
  }
);
```

### Redis Rate Limiting

```typescript
// lib/redis.ts
import { safeRedisOperation } from './componentIsolation';

export async function checkRateLimitRedis(...) {
  return safeRedisOperation(
    async () => {
      // Операция с Redis
      const redis = await getRedisClient();
      // ...
    },
    () => {
      // Fallback на in-memory rate limiting
      return checkRateLimitMemory(...);
    }
  );
}
```

**Результат:** Если Redis атакован или недоступен, rate limiting переключается на in-memory хранилище.

---

## 🔍 Мониторинг состояния

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { getAllComponentsHealth, ComponentIsolationManager } from '../../../lib/componentIsolation';

const componentsHealth = getAllComponentsHealth();
const systemStatus = ComponentIsolationManager.getInstance().canSystemOperate();

return NextResponse.json({
  status: systemStatus.canOperate ? 'ok' : 'degraded',
  components: componentsHealth,
  warnings: systemStatus.warnings,
});
```

**Ответ:**
```json
{
  "status": "ok",
  "components": {
    "database": { "available": true, "state": "healthy" },
    "redis": { "available": false, "state": "unavailable" },
    "email": { "available": false, "state": "unavailable" }
  },
  "warnings": [
    "Важные компоненты недоступны: redis, email. Система работает в ограниченном режиме."
  ]
}
```

---

## 🚨 Сценарии атак

### Сценарий 1: Атака на Email сервис

**Что происходит:**
1. Атакующий отправляет множество запросов на email API
2. Email сервис перегружается
3. Circuit Breaker открывается после 5 ошибок
4. Все последующие запросы используют fallback
5. **Система продолжает работать:** обращения обрабатываются, просто без email уведомлений

**Результат:** Система устойчива к атаке на email.

### Сценарий 2: Атака на Redis

**Что происходит:**
1. Redis перегружается или недоступен
2. Circuit Breaker открывается
3. Rate limiting переключается на in-memory хранилище
4. **Система продолжает работать:** rate limiting работает локально

**Результат:** Система устойчива к атаке на Redis.

### Сценарий 3: Атака на CAPTCHA

**Что происходит:**
1. Google reCAPTCHA API недоступен
2. Circuit Breaker открывается
3. Fallback разрешает запрос (чтобы не блокировать легитимных пользователей)
4. **Система продолжает работать:** пользователи могут работать, но без CAPTCHA защиты

**Результат:** Система продолжает работать, но с пониженной защитой.

### Сценарий 4: Атака на базу данных

**Что происходит:**
1. База данных перегружается
2. Circuit Breaker открывается
3. **Система НЕ может работать:** база данных критична
4. Health check возвращает `status: 'degraded'`
5. Пользователи видят сообщение об обслуживании

**Результат:** Система корректно сообщает о недоступности.

---

## ✅ Преимущества

1. **Отказоустойчивость:** Система продолжает работать при атаках на некритичные компоненты
2. **Изоляция:** Атака на один компонент не влияет на другие
3. **Graceful Degradation:** Система работает с ограниченной функциональностью
4. **Автоматическое восстановление:** Компоненты автоматически восстанавливаются
5. **Мониторинг:** Видно состояние всех компонентов

---

## 📋 Чек-лист безопасности

- [x] Circuit Breaker для всех внешних сервисов
- [x] Fallback для каждого компонента
- [x] Изоляция компонентов
- [x] Health check endpoint
- [x] Мониторинг состояния компонентов
- [x] Graceful degradation
- [x] Автоматическое восстановление

---

## 🔧 Настройка

### Настройка Circuit Breaker

```typescript
// Для критичных компонентов (база данных)
const breaker = getCircuitBreaker('database', {
  failureThreshold: 3,  // Меньше ошибок для открытия
  resetTimeout: 30000,    // Быстрее восстановление
});

// Для некритичных компонентов (email)
const breaker = getCircuitBreaker('email', {
  failureThreshold: 10,  // Больше ошибок
  resetTimeout: 120000,   // Дольше восстановление
});
```

---

## 📚 Дополнительные ресурсы

- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Microservices Patterns](https://microservices.io/patterns/reliability/circuit-breaker.html)
- [Resilience Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

---

**Итог:** Система спроектирована так, чтобы продолжать работать даже при атаках на отдельные компоненты. Каждый компонент изолирован и имеет свой fallback механизм.



