# Метрики и мониторинг API

**Дата:** 2024-12-19  
**Статус:** ✅ Реализовано

---

## 📊 Endpoints для мониторинга

### Backend (FastAPI)

#### 1. `/health` - Простая проверка
```bash
curl https://api.oss-dvfu.ru/health
```

**Ответ:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-19T10:00:00.000Z",
  "version": "2.0.0",
  "service": "OSS DVFU API"
}
```

#### 2. `/health/detailed` - Детальная проверка
```bash
curl https://api.oss-dvfu.ru/health/detailed
```

**Ответ:**
```json
{
  "status": "ok",
  "checks": {
    "database": true,
    "redis": true,
    "supabase": true
  },
  "errors": null,
  "timestamp": "2024-12-19T10:00:00.000Z",
  "version": "2.0.0"
}
```

**Статусы:**
- `ok` - все проверки прошли
- `degraded` - некоторые проверки не прошли
- `error` - критические проверки не прошли

#### 3. `/metrics` - Метрики API
```bash
curl https://api.oss-dvfu.ru/metrics
```

**Ответ:**
```json
{
  "timestamp": "2024-12-19T10:00:00.000Z",
  "window_minutes": 5,
  "total_requests": 1250,
  "total_errors": 5,
  "error_rate": 0.4,
  "top_endpoints": {
    "GET /api/appeals": {
      "count": 450,
      "errors": 2,
      "avg_duration": 125.5
    },
    "POST /api/appeals": {
      "count": 320,
      "errors": 1,
      "avg_duration": 89.2
    }
  },
  "active_requests": 3
}
```

---

### Frontend (Next.js)

#### 1. `/api/health` - Проверка frontend
```bash
curl https://oss-dvfu.ru/api/health
```

**Ответ:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-19T10:00:00.000Z",
  "version": "1.0.0",
  "service": "OSS DVFU Frontend",
  "supabase": {
    "configured": true,
    "url": "https://xxx.supabase.co...",
    "key": "eyJhbGciOi..."
  },
  "environment": "production",
  "vercel": {
    "region": "iad1",
    "deployment": "abc123"
  }
}
```

#### 2. `/api/metrics` - Метрики frontend
```bash
curl https://oss-dvfu.ru/api/metrics
```

**Ответ:**
```json
{
  "timestamp": "2024-12-19T10:00:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600,
  "memory": {
    "used": 45,
    "total": 128,
    "rss": 256
  },
  "vercel": {
    "region": "iad1",
    "deployment": "abc123"
  }
}
```

---

## 📈 HTTP Headers

Все ответы API включают следующие заголовки:

### Backend:
- `X-Process-Time` - время обработки запроса (секунды)
- `X-Request-ID` - уникальный ID запроса
- `X-API-Version` - версия API (2.0.0)
- `X-RateLimit-Limit` - лимит запросов
- `X-RateLimit-Remaining` - оставшиеся запросы
- `X-RateLimit-Reset` - время сброса лимита (Unix timestamp)

### Frontend:
- `X-API-Version` - версия API (1.0.0)

---

## 🔍 Использование метрик

### Мониторинг здоровья системы

```bash
# Проверка каждые 30 секунд
watch -n 30 'curl -s https://api.oss-dvfu.ru/health/detailed | jq .status'
```

### Отслеживание ошибок

```bash
# Получить метрики и проверить error_rate
curl -s https://api.oss-dvfu.ru/metrics | jq '.error_rate'
```

### Мониторинг производительности

```bash
# Получить топ медленных endpoints
curl -s https://api.oss-dvfu.ru/metrics | jq '.top_endpoints | to_entries | sort_by(.value.avg_duration) | reverse'
```

---

## 🚨 Алерты

### Рекомендуемые пороги:

1. **Health Check:**
   - Если `status != "ok"` → алерт

2. **Error Rate:**
   - Если `error_rate > 5%` → предупреждение
   - Если `error_rate > 10%` → критический алерт

3. **Response Time:**
   - Если `avg_duration > 1000ms` → предупреждение
   - Если `avg_duration > 5000ms` → критический алерт

4. **Database:**
   - Если `checks.database == false` → критический алерт

---

## 📊 Интеграция с мониторингом

### Prometheus (будущее)

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'oss-dvfu-api'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['api.oss-dvfu.ru']
```

### Grafana Dashboard

Можно создать дашборд с:
- Request rate
- Error rate
- Response time
- Active requests
- Health status

---

## 🔧 Настройка

### Backend

Метрики собираются автоматически через middleware.

Для настройки окна метрик:
```python
# backend/python/metrics.py
_metrics_window = timedelta(minutes=5)  # Изменить на нужное значение
```

### Frontend

Метрики доступны через `/api/metrics`.

---

**Мониторинг настроен!** 📊

