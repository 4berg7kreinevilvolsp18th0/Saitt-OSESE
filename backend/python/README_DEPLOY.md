# 🚀 Быстрое развертывание на Railway

## ⚠️ КРИТИЧНО: Настройка Root Directory

**Самая частая ошибка:** Railway не может найти файлы, если Root Directory не указан!

### Шаг 1: Создание проекта

1. Зайдите на [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Выберите ваш репозиторий

### Шаг 2: Настройка сервиса (ВАЖНО!)

**В настройках сервиса:**

1. Откройте **Settings** → **Service Settings**
2. **Root Directory:** `backend/python` ⚠️ **ОБЯЗАТЕЛЬНО!**
3. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`
4. **Build Command:** (оставьте пустым)
5. Сохраните

### Шаг 3: База данных

1. **+ New** → **Database** → **Add PostgreSQL**
2. Railway автоматически создаст переменную `DATABASE_URL`

### Шаг 4: Переменные окружения

В **Variables** добавьте:

```env
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ALLOWED_ORIGINS=https://your-site.vercel.app
DEBUG=False
ENVIRONMENT=production
```

### Шаг 5: Деплой

Railway автоматически задеплоит. Дождитесь завершения.

---

## ✅ Проверка

```bash
curl https://your-api.railway.app/health
# Должно вернуть: {"status":"ok"}
```

Откройте в браузере:
- `https://your-api.railway.app/docs` - Swagger UI
- `https://your-api.railway.app/redoc` - ReDoc

---

## 🔧 Если ошибка "Railpack could not determine"

1. **Проверьте Root Directory** = `backend/python`
2. **Убедитесь, что Start Command указан**
3. **Проверьте логи** в Railway Dashboard
4. **Пересоздайте сервис**, если не помогает

**Подробнее:** [`docs/ru/BACKEND_FIX_RAILWAY.md`](../../docs/ru/BACKEND_FIX_RAILWAY.md)

