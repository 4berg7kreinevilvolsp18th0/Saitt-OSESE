# Устранение проблем с Railway

## ⚠️ Ошибка: "Script start.sh not found" или "Railpack could not determine how to build the app"

### Причина
Railway не может автоматически определить тип приложения или не находит файлы конфигурации.

### Решение 1: Проверьте Root Directory

**В настройках Railway проекта:**
1. Откройте ваш сервис
2. Перейдите в **Settings** → **Service Settings**
3. Убедитесь, что **Root Directory** установлен: `backend/python`
4. Сохраните и перезапустите деплой

### Решение 2: Убедитесь, что файлы на месте

В директории `backend/python/` должны быть:
- ✅ `requirements.txt` - обязательно!
- ✅ `main.py` - точка входа
- ✅ `nixpacks.toml` - конфигурация для Nixpacks (создан)
- ✅ `railway.json` - конфигурация Railway (создан)
- ✅ `Procfile` - для запуска (создан)
- ✅ `start.sh` - скрипт запуска (создан)

### Решение 3: Явно укажите Start Command

В настройках Railway:
1. **Settings** → **Service Settings**
2. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`
3. Сохраните

### Решение 4: Проверьте логи

1. Откройте **Deployments** → последний деплой
2. Проверьте логи сборки
3. Ищите ошибки типа:
   - `No such file or directory: requirements.txt`
   - `ModuleNotFoundError`
   - `Command not found: uvicorn`

### Решение 5: Пересоздайте сервис

Если ничего не помогает:
1. Удалите текущий сервис
2. Создайте новый
3. Укажите **Root Directory:** `backend/python` сразу при создании
4. Добавьте переменные окружения
5. Задеплойте заново

---

## ✅ Правильная настройка Railway

### Шаг 1: Создание сервиса

1. **New Project** → **Deploy from GitHub repo**
2. Выберите репозиторий
3. **Configure Service**

### Шаг 2: Настройки

```
Root Directory: backend/python
Build Command: (оставьте пустым)
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2
```

### Шаг 3: Переменные окружения

Добавьте в **Variables**:
- `DATABASE_URL` (автоматически, если добавили PostgreSQL)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ALLOWED_ORIGINS`
- `DEBUG=False`
- `ENVIRONMENT=production`

### Шаг 4: Деплой

Railway автоматически:
1. Обнаружит `requirements.txt`
2. Установит зависимости через Nixpacks
3. Запустит приложение по Start Command

---

## 🔍 Проверка работоспособности

После деплоя:

```bash
# Health check
curl https://your-api.railway.app/health

# Должно вернуть:
{"status":"ok"}
```

Если ошибка:
1. Проверьте логи в Railway Dashboard
2. Убедитесь, что все переменные окружения установлены
3. Проверьте, что Root Directory правильный

---

## 📝 Чек-лист

- [ ] Root Directory установлен: `backend/python`
- [ ] `requirements.txt` существует в `backend/python/`
- [ ] `main.py` существует в `backend/python/`
- [ ] Start Command указан: `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`
- [ ] Все переменные окружения добавлены
- [ ] PostgreSQL база данных добавлена
- [ ] Деплой выполнен успешно
- [ ] Health check проходит

---

**Если проблема не решена:** Проверьте логи деплоя в Railway Dashboard для детальной информации об ошибке.

