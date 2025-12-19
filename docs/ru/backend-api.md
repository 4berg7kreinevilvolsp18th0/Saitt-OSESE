# Backend API Документация

FastAPI backend для сайта ОСС ДВФУ.

## Быстрый старт

### Установка

```bash
cd backend/python
pip install -r requirements.txt
```

### Настройка

Создайте `.env` файл:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Запуск

```bash
uvicorn main:app --reload
```

API будет доступен на [http://localhost:8000](http://localhost:8000)

Документация: [http://localhost:8000/docs](http://localhost:8000/docs)

## Основные endpoints

### Обращения

- `POST /api/appeals` - Создать обращение
- `GET /api/appeals/token/{token}` - Получить обращение по токену
- `GET /api/appeals` - Список обращений (с фильтрами)
- `PATCH /api/appeals/{id}` - Обновить обращение

### Вложения

- `GET /api/appeals/{id}/attachments` - Список вложений
- `POST /api/attachments` - Создать вложение
- `DELETE /api/attachments/{id}` - Удалить вложение

### Фильтры

- `?status=new` - По статусу
- `?priority=high` - По приоритету
- `?assigned_to=user-uuid` - По назначенному
- `?overdue_only=true` - Просроченные

## Примеры использования

### Создать обращение

```bash
curl -X POST http://localhost:8000/api/appeals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Проблема с отоплением",
    "description": "В комнате 101 холодно",
    "contact_type": "email",
    "contact_value": "student@example.com",
    "direction_id": null
  }'
```

### Обновить обращение

```bash
curl -X PATCH http://localhost:8000/api/appeals/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "in_progress",
    "priority": "high",
    "assigned_to": "user-uuid",
    "deadline": "2024-12-31"
  }'
```

### Получить просроченные обращения

```bash
curl http://localhost:8000/api/appeals?overdue_only=true \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Аутентификация

Для защищённых endpoints требуется токен Supabase:

```bash
curl http://localhost:8000/api/appeals \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

## Полная документация

После запуска сервера:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

