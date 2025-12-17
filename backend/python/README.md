# OSS DVFU Backend API

FastAPI backend для сайта ОСС ДВФУ.

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

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Заполните `DATABASE_URL` с учётными данными вашей базы данных.

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
├── schemas.py       # Pydantic схемы
├── crud.py          # CRUD операции
├── database.py      # Подключение к БД
├── requirements.txt # Зависимости
└── .env.example     # Пример переменных окружения
```

## API Endpoints

### Публичные (не требуют аутентификации)

- `POST /api/appeals` - Создать обращение
- `GET /api/appeals/token/{token}` - Получить обращение по токену
- `GET /api/directions` - Список направлений
- `GET /api/content` - Список контента (опубликованного)
- `GET /api/documents` - Список документов

### Административные (требуют аутентификации в production)

- `GET /api/appeals` - Список всех обращений
- `PATCH /api/appeals/{id}` - Обновить обращение
- `GET /api/appeals/stats/summary` - Статистика обращений
- `POST /api/content` - Создать контент
- `PATCH /api/content/{id}` - Обновить контент
- `POST /api/documents` - Создать документ
- `GET /api/users/{id}/roles` - Роли пользователя
- `POST /api/users/roles` - Создать роль

## Аутентификация

В текущей версии аутентификация не реализована. В production необходимо:

1. Добавить проверку токенов Supabase Auth
2. Реализовать middleware для проверки ролей
3. Ограничить доступ к административным endpoints

Пример middleware:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    # Проверка токена через Supabase
    # Возврат пользователя и его ролей
    pass
```

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

