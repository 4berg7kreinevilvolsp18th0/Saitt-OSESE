# Развертывание бэкенда

Полное руководство по развертыванию FastAPI бэкенда для ОСС ДВФУ.

---

## 🎯 Варианты развертывания

### 1. Railway (Рекомендуется) ⭐
- ✅ Бесплатный план: $5 кредитов/месяц
- ✅ Автоматический деплой из GitHub
- ✅ Встроенная поддержка PostgreSQL
- ✅ Простая настройка

### 2. Render
- ✅ Бесплатный план с ограничениями
- ✅ Автоматический деплой
- ✅ Простая настройка

### 3. Fly.io
- ✅ Бесплатный план: 3 shared VMs
- ✅ Глобальная сеть
- ✅ Docker-based

### 4. DigitalOcean App Platform
- ⚠️ Платный (от $5/месяц)
- ✅ Профессиональный хостинг

---

## 🚀 Вариант 1: Railway (Рекомендуется)

### Шаг 1: Подготовка

1. Зарегистрируйтесь на [Railway.app](https://railway.app)
2. Подключите GitHub аккаунт

### Шаг 2: Создание проекта

1. Нажмите **"New Project"**
2. Выберите **"Deploy from GitHub repo"**
3. Выберите ваш репозиторий
4. Выберите **"Configure Service"**

### Шаг 3: Настройка сервиса

1. **Root Directory:** `backend/python` ⚠️ **ВАЖНО!**
2. **Build Command:** (оставьте пустым - Railway автоматически определит через Nixpacks)
3. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`

**Важно:** Railway автоматически обнаружит:
- `requirements.txt` - для установки зависимостей
- `nixpacks.toml` - для конфигурации сборки
- `Procfile` или `start.sh` - для запуска (если не указан Start Command)

### Шаг 4: Добавление базы данных

1. В проекте нажмите **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway автоматически создаст переменную `DATABASE_URL`

### Шаг 5: Переменные окружения

Добавьте в **Variables** секцию:

```env
# Database (автоматически создается Railway)
# DATABASE_URL - создается автоматически при добавлении PostgreSQL

# Supabase
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application
DEBUG=False
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-site.vercel.app

# Server
PORT=8000
WORKERS=2
```

### Шаг 6: Деплой

1. Railway автоматически задеплоит при push в GitHub
2. Получите URL вашего API (например: `https://your-api.railway.app`)

### Шаг 7: Проверка

```bash
curl https://your-api.railway.app/health
# Должно вернуть: {"status":"ok"}
```

---

## 🚀 Вариант 2: Render

### Шаг 1: Подготовка

1. Зарегистрируйтесь на [Render.com](https://render.com)
2. Подключите GitHub аккаунт

### Шаг 2: Создание Web Service

1. Нажмите **"New +"** → **"Web Service"**
2. Выберите ваш репозиторий
3. Настройте:
   - **Name:** `oss-dvfu-backend`
   - **Environment:** `Python 3`
   - **Root Directory:** `backend/python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`

### Шаг 3: База данных

1. Нажмите **"New +"** → **"PostgreSQL"**
2. Выберите **"Free"** план
3. Скопируйте **Internal Database URL**

### Шаг 4: Переменные окружения

В настройках Web Service добавьте:

```env
DATABASE_URL=<Internal Database URL из PostgreSQL сервиса>
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DEBUG=False
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-site.vercel.app
PORT=8000
WORKERS=2
```

### Шаг 5: Деплой

1. Нажмите **"Create Web Service"**
2. Render автоматически задеплоит
3. Получите URL (например: `https://oss-dvfu-backend.onrender.com`)

---

## 🚀 Вариант 3: Fly.io

### Шаг 1: Установка Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# macOS/Linux
curl -L https://fly.io/install.sh | sh
```

### Шаг 2: Авторизация

```bash
fly auth login
```

### Шаг 3: Создание приложения

```bash
cd backend/python
fly launch
```

Следуйте инструкциям:
- Выберите регион (например: `iad` для США)
- Создайте PostgreSQL базу данных: `Yes`
- Название приложения: `oss-dvfu-backend`

### Шаг 4: Настройка переменных окружения

```bash
fly secrets set \
  SUPABASE_URL=https://[PROJECT].supabase.co \
  SUPABASE_ANON_KEY=your-anon-key \
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
  DEBUG=False \
  ENVIRONMENT=production \
  ALLOWED_ORIGINS=https://your-site.vercel.app
```

### Шаг 5: Деплой

```bash
fly deploy
```

### Шаг 6: Проверка

```bash
fly open
# Откроет ваш API в браузере
```

---

## 🐳 Вариант 4: Docker (универсальный)

### Шаг 1: Сборка образа

```bash
cd backend/python
docker build -t oss-dvfu-backend .
```

### Шаг 2: Запуск контейнера

```bash
docker run -d \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  -e SUPABASE_URL=https://... \
  -e SUPABASE_ANON_KEY=... \
  -e ALLOWED_ORIGINS=https://your-site.vercel.app \
  --name oss-backend \
  oss-dvfu-backend
```

### Шаг 3: Проверка

```bash
curl http://localhost:8000/health
```

---

## 🔧 Настройка переменных окружения

### Обязательные переменные

| Переменная | Описание | Где взять |
|-----------|----------|-----------|
| `DATABASE_URL` | Строка подключения к PostgreSQL | Supabase → Settings → Database → Connection string |
| `SUPABASE_URL` | URL проекта Supabase | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Анонимный ключ | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role ключ | Supabase → Settings → API → service_role |
| `ALLOWED_ORIGINS` | Разрешенные домены | Ваш frontend URL (Vercel) |

### Опциональные переменные

| Переменная | Значение по умолчанию | Описание |
|-----------|----------------------|----------|
| `DEBUG` | `False` | Режим отладки |
| `ENVIRONMENT` | `production` | Окружение |
| `PORT` | `8000` | Порт сервера |
| `WORKERS` | `2` | Количество worker процессов |
| `REDIS_URL` | - | URL Redis (для rate limiting) |

---

## 🔐 Безопасность

### 1. CORS настройка

Убедитесь, что `ALLOWED_ORIGINS` содержит только ваши домены:

```env
ALLOWED_ORIGINS=https://your-site.vercel.app,https://www.your-site.com
```

### 2. Аутентификация

В production добавьте проверку аутентификации к защищенным endpoints:

```python
from auth import get_current_user

@app.get("/api/appeals")
def get_appeals(
    user: dict = Depends(get_current_user),  # Добавить это
    db: Session = Depends(get_db)
):
    # Ваша логика
```

### 3. Rate Limiting

Rate limiting уже настроен через `slowapi`. Убедитесь, что Redis настроен (опционально).

---

## 📊 Мониторинг и логи

### Railway

- Логи доступны в Dashboard → Deployments → View Logs
- Метрики: CPU, Memory, Network

### Render

- Логи доступны в Dashboard → Logs
- Метрики: CPU, Memory

### Fly.io

```bash
# Просмотр логов
fly logs

# Метрики
fly metrics
```

---

## 🔄 Автоматический деплой

### Railway

Автоматически деплоит при push в `main` ветку.

### Render

1. В настройках Web Service
2. **Auto-Deploy:** `Yes`
3. **Branch:** `main`

### Fly.io

```bash
# Настройка CI/CD через GitHub Actions
fly deploy --remote-only
```

---

## 🧪 Тестирование после деплоя

### 1. Health Check

```bash
curl https://your-api.railway.app/health
```

Ожидаемый ответ:
```json
{"status":"ok"}
```

### 2. API Documentation

Откройте в браузере:
- Swagger UI: `https://your-api.railway.app/docs`
- ReDoc: `https://your-api.railway.app/redoc`

### 3. Тестовый запрос

```bash
# Получить направления
curl https://your-api.railway.app/api/directions

# Health check
curl https://your-api.railway.app/health
```

---

## 🐛 Устранение проблем

### Ошибка подключения к БД

**Проблема:** `could not connect to server`

**Решение:**
1. Проверьте `DATABASE_URL` в переменных окружения
2. Убедитесь, что БД доступна из интернета (для Supabase это должно работать)
3. Проверьте firewall настройки

### Ошибка CORS

**Проблема:** `CORS policy: No 'Access-Control-Allow-Origin'`

**Решение:**
1. Добавьте ваш frontend URL в `ALLOWED_ORIGINS`
2. Перезапустите сервис

### Ошибка импорта модулей

**Проблема:** `ModuleNotFoundError`

**Решение:**
1. Убедитесь, что `requirements.txt` содержит все зависимости
2. Проверьте, что `Root Directory` указан правильно (`backend/python`)

### Ошибка порта

**Проблема:** `Address already in use`

**Решение:**
1. Используйте переменную `$PORT` (Railway/Render автоматически устанавливают)
2. Для Fly.io: проверьте `fly.toml`

---

## 📚 Дополнительные ресурсы

- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Fly.io Documentation](https://fly.io/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## ✅ Чек-лист развертывания

- [ ] Выбран хостинг (Railway/Render/Fly.io)
- [ ] Создан проект/сервис
- [ ] Настроен Root Directory (`backend/python`)
- [ ] Добавлена база данных (PostgreSQL)
- [ ] Настроены переменные окружения
- [ ] Деплой выполнен успешно
- [ ] Health check проходит (`/health`)
- [ ] API документация доступна (`/docs`)
- [ ] CORS настроен правильно
- [ ] Frontend подключен к API

---

**Бэкенд готов к работе!** 🚀

