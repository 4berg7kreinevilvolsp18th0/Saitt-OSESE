# Быстрое развертывание бэкенда

## 🚀 Railway (5 минут)

### ⚠️ ВАЖНО: Настройка Root Directory

1. Зайдите на [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Выберите репозиторий
4. **Настройки (критично!):**
   - **Root Directory:** `backend/python` ⚠️ **ОБЯЗАТЕЛЬНО!**
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`
   - **Build Command:** (оставьте пустым)
5. **+ New** → **Database** → **Add PostgreSQL**
6. **Variables** → Добавьте:
   ```
   SUPABASE_URL=https://[PROJECT].supabase.co
   SUPABASE_ANON_KEY=your-key
   SUPABASE_SERVICE_ROLE_KEY=your-key
   ALLOWED_ORIGINS=https://your-site.vercel.app
   DEBUG=False
   ENVIRONMENT=production
   ```
7. Сохраните и дождитесь деплоя
8. Готово! API доступен по URL из Railway

### 🔧 Если ошибка "Railpack could not determine how to build"

1. Проверьте, что **Root Directory** = `backend/python`
2. Убедитесь, что в `backend/python/` есть:
   - ✅ `requirements.txt`
   - ✅ `main.py`
   - ✅ `nixpacks.toml` (создан автоматически)
3. Явно укажите **Start Command** в настройках
4. Перезапустите деплой

**Подробнее:** [`docs/ru/RAILWAY_TROUBLESHOOTING.md`](../../docs/ru/RAILWAY_TROUBLESHOOTING.md)

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

