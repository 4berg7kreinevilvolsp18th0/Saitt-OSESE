# Быстрое развертывание бэкенда

## 🚀 Railway (5 минут)

1. Зайдите на [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Выберите репозиторий
4. Настройки:
   - **Root Directory:** `backend/python`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`
5. **+ New** → **Database** → **Add PostgreSQL**
6. **Variables** → Добавьте:
   ```
   SUPABASE_URL=https://[PROJECT].supabase.co
   SUPABASE_ANON_KEY=your-key
   SUPABASE_SERVICE_ROLE_KEY=your-key
   ALLOWED_ORIGINS=https://your-site.vercel.app
   DEBUG=False
   ```
7. Готово! API доступен по URL из Railway

## ✅ Проверка

```bash
curl https://your-api.railway.app/health
# Должно вернуть: {"status":"ok"}
```

Откройте в браузере:
- `https://your-api.railway.app/docs` - Swagger UI
- `https://your-api.railway.app/redoc` - ReDoc

## 📚 Подробная инструкция

См. [`docs/ru/BACKEND_DEPLOYMENT.md`](../../docs/ru/BACKEND_DEPLOYMENT.md)

