# ✅ Чек-лист развертывания бэкенда на Railway

## 📋 Перед развертыванием

### Файлы в `backend/python/` (должны быть):

- [x] `requirements.txt` - зависимости Python
- [x] `main.py` - точка входа FastAPI
- [x] `nixpacks.toml` - конфигурация Nixpacks
- [x] `railway.json` - конфигурация Railway
- [x] `Procfile` - команда запуска
- [x] `start.sh` - скрипт запуска
- [x] `.python-version` - версия Python
- [x] `__init__.py` - маркер Python пакета

---

## 🚀 Настройка Railway

### 1. Создание проекта

- [ ] Зарегистрировались на Railway.app
- [ ] Создали новый проект
- [ ] Подключили GitHub репозиторий

### 2. Настройка сервиса (КРИТИЧНО!)

- [ ] **Root Directory:** `backend/python` ⚠️ **ОБЯЗАТЕЛЬНО!**
- [ ] **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`
- [ ] **Build Command:** (пусто)
- [ ] Сохранили настройки

### 3. База данных

- [ ] Добавили PostgreSQL базу данных
- [ ] Railway автоматически создал `DATABASE_URL`

### 4. Переменные окружения

Добавьте в **Variables**:

- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `ALLOWED_ORIGINS` (ваш frontend URL)
- [ ] `DEBUG=False`
- [ ] `ENVIRONMENT=production`
- [ ] `PORT=8000` (опционально)
- [ ] `WORKERS=2` (опционально)

### 5. Деплой

- [ ] Сохранили все настройки
- [ ] Дождались завершения деплоя
- [ ] Проверили логи (нет ошибок)

---

## ✅ Проверка после деплоя

- [ ] Health check работает: `curl https://your-api.railway.app/health`
- [ ] Swagger UI доступен: `https://your-api.railway.app/docs`
- [ ] ReDoc доступен: `https://your-api.railway.app/redoc`
- [ ] API отвечает на запросы

---

## 🔧 Если ошибки

### Ошибка: "Railpack could not determine"

1. Проверьте **Root Directory** = `backend/python`
2. Убедитесь, что **Start Command** указан
3. Проверьте логи в Railway Dashboard
4. Пересоздайте сервис, если не помогает

### Ошибка: "ModuleNotFoundError"

1. Проверьте, что `requirements.txt` содержит все зависимости
2. Проверьте логи установки зависимостей
3. Убедитесь, что Root Directory правильный

### Ошибка: "Connection refused" или "Database error"

1. Проверьте `DATABASE_URL` в переменных окружения
2. Убедитесь, что PostgreSQL база данных создана
3. Проверьте, что строка подключения правильная

---

## 📚 Документация

- **Быстрый старт:** [`QUICK_DEPLOY.md`](QUICK_DEPLOY.md)
- **Исправление ошибок:** [`../../docs/ru/BACKEND_FIX_RAILWAY.md`](../../docs/ru/BACKEND_FIX_RAILWAY.md)
- **Полное руководство:** [`../../docs/ru/BACKEND_DEPLOYMENT.md`](../../docs/ru/BACKEND_DEPLOYMENT.md)

---

**Готово к развертыванию!** 🚀

