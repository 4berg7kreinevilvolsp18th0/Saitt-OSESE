# Система защиты и изоляции компонентов

Этот документ описывает систему защиты проекта от атак и каскадных сбоев.

## 🎯 Принцип работы

**Главное правило:** При атаке на один компонент все остальное должно продолжать работать.

## 📦 Компоненты системы

### 1. Circuit Breaker (`circuitBreaker.ts`)

Защищает от каскадных сбоев. Если сервис недоступен, не пытаемся обращаться к нему.

**Состояния:**
- `CLOSED` - нормальная работа
- `OPEN` - сервис недоступен, запросы блокируются
- `HALF_OPEN` - пробуем восстановление

**Использование:**
```typescript
import { withCircuitBreaker } from './lib/circuitBreaker';

const result = await withCircuitBreaker(
  'supabase',
  async () => {
    // Код запроса
    return await supabase.from('table').select();
  },
  () => {
    // Fallback если сервис недоступен
    return { data: [], error: null };
  }
);
```

### 2. Service Isolation (`serviceIsolation.ts`)

Изолирует сервисы друг от друга. Ошибка в одном не влияет на другие.

**Использование:**
```typescript
import { withIsolation, requireService } from './lib/serviceIsolation';

// Проверка доступности
if (!requireService('telegram')) {
  // Использовать альтернативу
}

// Выполнение с изоляцией
const result = await withIsolation(
  'telegram',
  async () => {
    // Код отправки
    return await sendTelegramMessage();
  },
  { success: false } // Fallback
);
```

### 3. Graceful Degradation (`gracefulDegradation.ts`)

Плавная деградация функциональности. Система работает с ограниченными возможностями.

**Уровни:**
- `full` - все работает
- `degraded` - работают основные функции
- `minimal` - только базовая функциональность
- `offline` - система недоступна

**Использование:**
```typescript
import { requireFeature, getFeatureFallback } from './lib/gracefulDegradation';

if (requireFeature('notifications_telegram')) {
  await sendTelegram();
} else {
  const fallback = getFeatureFallback('notifications_telegram');
  if (fallback === 'notifications_email') {
    await sendEmail();
  }
}
```

## 🔧 Интеграция в код

### Supabase запросы

Уже интегрировано в `safeSupabaseQuery`:

```typescript
import { safeSupabaseQuery } from './lib/supabaseClient';

const { data, error } = await safeSupabaseQuery(
  async () => {
    return await supabase.from('table').select();
  }
);
// Автоматически использует circuit breaker
```

### Redis операции

Уже интегрировано в функции rate limiting:

```typescript
import { checkRateLimitRedis } from './lib/redis';

const limit = await checkRateLimitRedis(key, 100, 60);
// Автоматически использует circuit breaker и fallback
```

### Внешние API (Telegram, Email)

Пример интеграции в `app/api/notifications/telegram/route.ts`:

```typescript
import { withCircuitBreaker } from '../../../lib/circuitBreaker';
import { withIsolation } from '../../../lib/serviceIsolation';

const result = await withIsolation(
  'telegram',
  async () => {
    return await withCircuitBreaker(
      'telegram',
      async () => {
        // Отправка в Telegram
        return await fetch(...);
      },
      () => ({ success: false, skipped: true })
    );
  },
  { success: false, skipped: true }
);
```

## 📊 Мониторинг

### Health Check API

`GET /api/health/status` - расширенный health check:

```json
{
  "status": "healthy",
  "system": {
    "health": true,
    "degraded": false,
    "degradationLevel": "full",
    "message": "Все системы работают нормально"
  },
  "services": [
    {
      "name": "supabase",
      "healthy": true,
      "available": true
    }
  ],
  "circuitBreakers": [
    {
      "name": "supabase",
      "state": "CLOSED",
      "failures": 0
    }
  ]
}
```

## 🛡️ Защита от атак

### Принципы

1. **Изоляция:** Каждый сервис работает независимо
2. **Fallback:** Всегда есть альтернатива
3. **Circuit Breaker:** Не перегружаем недоступные сервисы
4. **Graceful Degradation:** Система работает даже при частичных сбоях

### Что происходит при атаке

1. **Атака на один сервис (например, Telegram):**
   - Circuit breaker открывается после нескольких ошибок
   - Запросы к Telegram блокируются
   - Используется fallback (например, Email)
   - Остальные сервисы продолжают работать

2. **Атака на Redis:**
   - Circuit breaker открывается
   - Используется in-memory fallback для rate limiting
   - Система продолжает работать

3. **Атака на Supabase:**
   - Circuit breaker открывается
   - API возвращает ошибки, но не падает
   - Статические страницы продолжают работать

## ⚙️ Настройка

### Circuit Breaker параметры

В `circuitBreaker.ts` можно настроить для каждого сервиса:

```typescript
supabase: new CircuitBreaker('supabase', {
  failureThreshold: 5,    // Количество ошибок до открытия
  resetTimeout: 60000,    // Время до попытки восстановления (мс)
  successThreshold: 2,    // Успешных запросов для закрытия
});
```

### Приоритеты сервисов

В `serviceIsolation.ts` можно указать критичные сервисы:

```typescript
const criticalServices = ['supabase']; // Без них система не работает
```

## 📝 Best Practices

1. **Всегда используйте fallback:**
   - Если сервис может быть недоступен, предоставьте альтернативу
   - Fallback должен быть быстрым и не требовать внешних зависимостей

2. **Не выбрасывайте ошибки критично:**
   - Если функция не критична (например, уведомления), не блокируйте основной поток
   - Возвращайте fallback значения

3. **Логируйте сбои:**
   - Важно знать о проблемах, но не паниковать
   - Используйте уровни логирования (warn для fallback, error для критичных)

4. **Мониторьте состояние:**
   - Используйте `/api/health/status` для мониторинга
   - Настройте алерты на критичные сбои

## 🔍 Отладка

### Проверка состояния circuit breakers

```typescript
import { circuitBreakers } from './lib/circuitBreaker';

const stats = circuitBreakers.supabase.getStats();
console.log(stats);
// { name: 'supabase', state: 'CLOSED', failures: 0, ... }
```

### Ручной сброс circuit breaker

```typescript
circuitBreakers.supabase.reset();
```

### Проверка доступности сервисов

```typescript
import { serviceIsolation } from './lib/serviceIsolation';

const health = serviceIsolation.getSystemHealth();
console.log(health);
// { healthy: true, services: [...], degraded: false }
```

---

**Важно:** Система защиты работает автоматически. Просто используйте существующие функции (`safeSupabaseQuery`, `checkRateLimitRedis`) и они будут защищены.



