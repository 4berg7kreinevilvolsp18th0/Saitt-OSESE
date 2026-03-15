# Исправление ошибок Railway

## ⚠️ Ошибка: "Script start.sh not found" или "Railpack could not determine how to build"

### Решение 1: Правильная настройка Root Directory

**КРИТИЧНО:** В Railway Dashboard:

1. Откройте ваш сервис
2. **Settings** → **Service Settings**
3. **Root Directory:** `backend/python` ⚠️ **ОБЯЗАТЕЛЬНО!**
4. Сохраните

### Решение 2: Явно укажите Start Command

В настройках сервиса:

1. **Settings** → **Service Settings**
2. **Start Command:** 
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2
   ```
3. **Build Command:** (оставьте пустым)
4. Сохраните

### Решение 3: Проверьте файлы

Убедитесь, что в `backend/python/` есть:

- ✅ `requirements.txt` - **ОБЯЗАТЕЛЬНО!**
- ✅ `main.py` - точка входа
- ✅ `nixpacks.toml` - конфигурация Nixpacks
- ✅ `.python-version` - версия Python (создан)
- ✅ `__init__.py` - маркер Python пакета (создан)

### Решение 4: Пересоздайте сервис

Если ничего не помогает:

1. **Удалите** текущий сервис
2. **Создайте новый:**
   - New → Deploy from GitHub repo
   - Выберите репозиторий
   - **Сразу укажите Root Directory:** `backend/python`
3. **Настройте:**
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`
4. **Добавьте переменные окружения**
5. **Задеплойте**

---

## ✅ Правильная последовательность настройки

### Шаг 1: Создание сервиса

1. Railway Dashboard → **New Project**
2. **Deploy from GitHub repo**
3. Выберите репозиторий
4. **Configure Service**

### Шаг 2: Настройки (КРИТИЧНО!)

```
Root Directory: backend/python
Build Command: (пусто)
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2
```

### Шаг 3: База данных

1. **+ New** → **Database** → **Add PostgreSQL**
2. Railway автоматически создаст `DATABASE_URL`

### Шаг 4: Переменные окружения

В **Variables** добавьте:

```env
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ALLOWED_ORIGINS=https://your-site.vercel.app
DEBUG=False
ENVIRONMENT=production
PORT=8000
WORKERS=2
```

### Шаг 5: Деплой

1. Сохраните все настройки
2. Railway автоматически начнет деплой
3. Дождитесь завершения

---

## 🔍 Проверка после деплоя

```bash
# Health check
curl https://your-api.railway.app/health

# Должно вернуть:
{"status":"ok"}
```

Если ошибка - проверьте логи в Railway Dashboard.

---

## 📝 Чек-лист

- [ ] Root Directory = `backend/python`
- [ ] Start Command указан
- [ ] `requirements.txt` существует
- [ ] `main.py` существует
- [ ] `nixpacks.toml` существует
- [ ] `.python-version` существует
- [ ] Все переменные окружения добавлены
- [ ] PostgreSQL база данных добавлена
- [ ] Деплой выполнен успешно

---

**Если проблема не решена:** Проверьте логи деплоя в Railway Dashboard для детальной информации.

