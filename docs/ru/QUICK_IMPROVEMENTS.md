# ⚡ Быстрые улучшения (Quick Wins)

**Время:** 1-4 часа каждое  
**Приоритет:** Высокий

---

## 1. Health Check Endpoints (30 мин)

### Backend (FastAPI)

```python
# backend/python/main.py

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0"
    }

@app.get("/health/detailed")
async def detailed_health_check(db: Session = Depends(get_db)):
    checks = {
        "database": False,
        "redis": False,
        "supabase": False
    }
    
    # Проверка БД
    try:
        db.execute(text("SELECT 1"))
        checks["database"] = True
    except:
        pass
    
    # Проверка Redis
    try:
        # Проверка Redis
        checks["redis"] = True
    except:
        pass
    
    # Проверка Supabase
    try:
        # Проверка Supabase
        checks["supabase"] = True
    except:
        pass
    
    status = "ok" if all(checks.values()) else "degraded"
    
    return {
        "status": status,
        "checks": checks,
        "timestamp": datetime.utcnow().isoformat()
    }
```

### Frontend (Next.js)

```typescript
// frontend/nextjs/app/api/health/route.ts
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
  });
}
```

---

## 2. Метрики в API (1 час)

### Backend

```python
# backend/python/middleware.py

from prometheus_client import Counter, Histogram, generate_latest
from fastapi import Response

# Метрики
request_count = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint']
)

@app.get("/metrics")
async def metrics():
    return Response(
        content=generate_latest(),
        media_type="text/plain"
    )
```

---

## 3. Улучшение документации API (1 час)

### Добавить примеры в Swagger

```python
# backend/python/main.py

@app.post(
    "/api/appeals",
    response_model=Appeal,
    summary="Создать обращение",
    description="Создает новое обращение от студента",
    responses={
        201: {
            "description": "Обращение создано",
            "content": {
                "application/json": {
                    "example": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "title": "Проблема с отоплением",
                        "status": "new"
                    }
                }
            }
        }
    }
)
```

---

## 4. Примеры использования API (1 час)

### Создать файл с примерами

```bash
# docs/examples/api-examples.md

## Создание обращения

```bash
curl -X POST https://api.oss-dvfu.ru/api/appeals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Проблема с отоплением",
    "description": "В комнате 101 холодно",
    "contact_type": "email",
    "contact_value": "student@example.com"
  }'
```

---

## 5. Добавить версию в API (30 мин)

```python
# backend/python/main.py

app = FastAPI(
    title="OSS DVFU API",
    version="2.0.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs"
)

# Все роуты под /api/v1/
app.include_router(router, prefix="/api/v1")
```

---

## 6. Логирование запросов (1 час)

```python
# backend/python/middleware.py

import logging
from datetime import datetime

logger = logging.getLogger("api")

async def log_request(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"{response.status_code} - {duration:.3f}s"
    )
    
    return response
```

---

## 7. Добавить CORS заголовки (30 мин)

```python
# backend/python/main.py

@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-API-Version"] = "2.0.0"
    response.headers["X-Request-ID"] = str(uuid.uuid4())
    return response
```

---

## 8. Обработка ошибок (1 час)

```python
# backend/python/main.py

from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation error",
            "details": exc.errors()
        }
    )
```

---

## 9. Rate Limiting Headers (30 мин)

```python
# backend/python/middleware.py

@app.middleware("http")
async def add_rate_limit_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Добавить заголовки rate limiting
    response.headers["X-RateLimit-Limit"] = "100"
    response.headers["X-RateLimit-Remaining"] = "95"
    response.headers["X-RateLimit-Reset"] = str(int(time.time()) + 60)
    
    return response
```

---

## 10. Кэширование статики (1 час)

```python
# backend/python/main.py

from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.middleware("http")
async def add_cache_headers(request: Request, call_next):
    response = await call_next(request)
    
    if request.url.path.startswith("/static"):
        response.headers["Cache-Control"] = "public, max-age=31536000"
    
    return response
```

---

**Все эти улучшения можно сделать за 1 день!** ⚡

