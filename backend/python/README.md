# OSS DVFU Backend API

FastAPI backend для сайта ОСС ДВФУ.

## Возможности

- ✅ RESTful API для всех сущностей (appeals, content, directions, documents)
- ✅ Поддержка новых функций: приоритеты, назначение ответственных, теги
- ✅ CRUD операции для вложений к обращениям
- ✅ Фильтрация по статусу, приоритету, назначенным пользователям
- ✅ Поиск просроченных обращений
- ✅ Аутентификация через Supabase (базовая реализация)
- ✅ Обработка ошибок и валидация
- ✅ Автоматическая документация API (Swagger/ReDoc)

## Установка

### Требования
- Python 3.11+
- PostgreSQL или Supabase

### Установка зависимостей

```bash
cd backend/python
pip install -r requirements.txt
```

### Настройка переменных окружения

Создайте файл `.env`:

```env
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Supabase (для аутентификации)
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Application
DEBUG=True
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:3000,https://your-site.vercel.app
```

## Запуск

### Режим разработки

```bash
uvicorn main:app --reload
```

API будет доступен на [http://localhost:8000](http://localhost:8000)

### Production

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Документация API

После запуска сервера документация доступна по адресам:

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Структура проекта

```
backend/python/
├── main.py          # FastAPI приложение и роуты
├── models.py        # SQLAlchemy модели
├── schemas.py       # Pydantic схемы для валидации
├── crud.py          # CRUD операции
├── database.py      # Подключение к БД
├── auth.py          # Аутентификация через Supabase
├── errors.py        # Обработка ошибок
├── requirements.txt # Зависимости
└── .env.example     # Пример переменных окружения
```

## Новые функции

### Приоритеты обращений

Обращения теперь поддерживают приоритеты: `low`, `normal`, `high`, `urgent`

```python
# Обновить приоритет
PATCH /api/appeals/{id}
{
  "priority": "high"
}

# Фильтр по приоритету
GET /api/appeals?priority=urgent
```

### Назначение ответственных

```python
# Назначить ответственного
PATCH /api/appeals/{id}
{
  "assigned_to": "user-uuid"
}

# Получить обращения пользователя
GET /api/appeals?assigned_to=user-uuid
```

### Теги

```python
# Добавить теги
PATCH /api/appeals/{id}
{
  "tags": ["общага", "ремонт", "срочно"]
}
```

### Вложения

```python
# Создать вложение
POST /api/attachments
{
  "appeal_id": "appeal-uuid",
  "file_name": "document.pdf",
  "file_url": "https://storage.supabase.co/...",
  "file_size": 1024000,
  "mime_type": "application/pdf"
}

# Получить вложения обращения
GET /api/appeals/{id}/attachments
```

### Просроченные обращения

```python
# Получить просроченные обращения
GET /api/appeals?overdue_only=true
```

## API Endpoints

### Публичные (не требуют аутентификации)

- `GET /health` - Проверка работоспособности
- `POST /api/appeals` - Создать обращение
- `GET /api/appeals/token/{token}` - Получить обращение по токену
- `GET /api/directions` - Список направлений
- `GET /api/directions/{id}` - Получить направление по ID
- `GET /api/directions/slug/{slug}` - Получить направление по slug
- `GET /api/content` - Список контента (опубликованного)
- `GET /api/content/{id}` - Получить контент по ID
- `GET /api/content/slug/{slug}` - Получить контент по slug
- `GET /api/documents` - Список документов

### Административные (требуют аутентификации в production)

#### Обращения
- `GET /api/appeals` - Список всех обращений
  - Параметры: `direction_id`, `status`, `priority`, `assigned_to`, `overdue_only`
- `GET /api/appeals/{id}` - Получить обращение по ID
- `PATCH /api/appeals/{id}` - Обновить обращение
- `GET /api/appeals/stats/summary` - Статистика обращений
- `GET /api/appeals/{id}/comments` - Комментарии к обращению
- `POST /api/appeals/{id}/comments` - Создать комментарий

#### Вложения
- `GET /api/appeals/{id}/attachments` - Список вложений обращения
- `GET /api/attachments/{id}` - Получить вложение по ID
- `POST /api/attachments` - Создать вложение
- `DELETE /api/attachments/{id}` - Удалить вложение

#### Контент
- `POST /api/content` - Создать контент
- `PATCH /api/content/{id}` - Обновить контент

#### Документы
- `POST /api/documents` - Создать документ

#### Пользователи и роли
- `GET /api/users/{id}/roles` - Роли пользователя
- `POST /api/users/roles` - Создать роль

## Аутентификация

Базовая аутентификация через Supabase реализована в `auth.py`.

### Использование в endpoints

```python
from auth import get_current_user, get_current_user_id

@app.get("/api/admin/appeals")
def get_admin_appeals(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # user содержит: id, email, user_metadata
    user_id = user["id"]
    # Ваша логика
```

### Проверка ролей

```python
from auth import require_role

@app.post("/api/appeals/{id}/close")
def close_appeal(
    appeal_id: UUID,
    user: dict = Depends(require_role("board")),  # Требует роль board
    db: Session = Depends(get_db)
):
    # Только пользователи с ролью board могут закрывать обращения
    ...
```

**Важно:** В текущей версии аутентификация опциональна. В production:
1. Добавьте `Depends(get_current_user)` к защищённым endpoints
2. Настройте проверку ролей через `check_role()`
3. Ограничьте CORS origins в `.env`

## Миграции базы данных

В production рекомендуется использовать Alembic для миграций:

```bash
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## Тестирование

```bash
# Запуск тестов (когда будут добавлены)
pytest
```

## Развёртывание

### Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment variables

Убедитесь, что в production установлены:
- `DATABASE_URL` - строка подключения к БД
- `DEBUG=False` - отключить debug режим

