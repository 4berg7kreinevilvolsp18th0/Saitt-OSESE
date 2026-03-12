# Примеры использования API

**Дата:** 2024-12-19  
**Версия API:** 2.0.0

---

## 🔐 Аутентификация

Все защищенные endpoints требуют токен Supabase:

```bash
export TOKEN="your-supabase-token"
```

---

## 📋 Обращения (Appeals)

### Создать обращение

```bash
curl -X POST https://api.oss-dvfu.ru/api/appeals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Проблема с отоплением",
    "description": "В комнате 101 очень холодно, батареи не работают",
    "contact_type": "email",
    "contact_value": "student@example.com",
    "direction_id": null,
    "is_anonymous": false
  }'
```

**Ответ:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Проблема с отоплением",
  "status": "new",
  "public_token": "abc123...",
  "created_at": "2024-12-19T10:00:00Z"
}
```

### Получить обращение по токену

```bash
curl https://api.oss-dvfu.ru/api/appeals/token/abc123...
```

### Получить список обращений

```bash
# Все обращения
curl -H "Authorization: Bearer $TOKEN" \
  https://api.oss-dvfu.ru/api/appeals

# С фильтрами
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.oss-dvfu.ru/api/appeals?status=new&priority=high&limit=20"
```

**Параметры:**
- `status` - фильтр по статусу (new, in_progress, waiting, closed)
- `priority` - фильтр по приоритету (low, normal, high, urgent)
- `direction_id` - фильтр по направлению
- `assigned_to` - фильтр по назначенному
- `overdue_only` - только просроченные (true/false)
- `skip` - пропустить N записей
- `limit` - количество записей (макс. 1000)

### Обновить обращение

```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  https://api.oss-dvfu.ru/api/appeals/123e4567-e89b-12d3-a456-426614174000 \
  -d '{
    "status": "in_progress",
    "priority": "high",
    "assigned_to": "user-uuid",
    "deadline": "2024-12-31"
  }'
```

### Добавить теги

```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  https://api.oss-dvfu.ru/api/appeals/123e4567-e89b-12d3-a456-426614174000 \
  -d '{
    "tags": ["общага", "ремонт", "срочно"]
  }'
```

---

## 📎 Вложения (Attachments)

### Создать вложение

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  https://api.oss-dvfu.ru/api/attachments \
  -d '{
    "appeal_id": "123e4567-e89b-12d3-a456-426614174000",
    "file_name": "photo.jpg",
    "file_url": "https://storage.supabase.co/...",
    "file_size": 1024000,
    "mime_type": "image/jpeg"
  }'
```

### Получить вложения обращения

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://api.oss-dvfu.ru/api/appeals/123e4567-e89b-12d3-a456-426614174000/attachments
```

### Удалить вложение

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  https://api.oss-dvfu.ru/api/attachments/attachment-uuid
```

---

## 💬 Комментарии (Comments)

### Добавить комментарий

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  https://api.oss-dvfu.ru/api/appeals/123e4567-e89b-12d3-a456-426614174000/comments \
  -d '{
    "message": "Обращение принято в работу",
    "is_internal": true
  }'
```

### Получить комментарии

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://api.oss-dvfu.ru/api/appeals/123e4567-e89b-12d3-a456-426614174000/comments
```

---

## 📰 Контент (Content)

### Получить контент

```bash
# Все опубликованные новости
curl https://api.oss-dvfu.ru/api/content?type=news&status=published

# По slug
curl https://api.oss-dvfu.ru/api/content/slug/my-news-article
```

**Параметры:**
- `type` - тип контента (news, guide, faq)
- `status` - статус (draft, published, archived)
- `direction_id` - фильтр по направлению

---

## 📁 Документы (Documents)

### Получить документы

```bash
# Все документы
curl https://api.oss-dvfu.ru/api/documents

# По направлению
curl "https://api.oss-dvfu.ru/api/documents?direction_id=direction-uuid"
```

---

## 🎯 Направления (Directions)

### Получить направления

```bash
# Все активные направления
curl https://api.oss-dvfu.ru/api/directions

# По slug
curl https://api.oss-dvfu.ru/api/directions/slug/legal
```

---

## 📊 Статистика

### Получить статистику обращений

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://api.oss-dvfu.ru/api/appeals/stats
```

**Ответ:**
```json
{
  "total": 150,
  "by_status": {
    "new": 45,
    "in_progress": 30,
    "waiting": 20,
    "closed": 55
  },
  "by_priority": {
    "urgent": 5,
    "high": 15,
    "normal": 100,
    "low": 30
  }
}
```

---

## 🔍 Поиск

### Полнотекстовый поиск

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.oss-dvfu.ru/api/appeals/search?q=студенческий+билет"
```

**Параметры:**
- `q` - поисковый запрос
- `direction_id` - фильтр по направлению
- `status` - фильтр по статусу
- `limit` - количество результатов

---

## 📈 Метрики

### Получить метрики API

```bash
curl https://api.oss-dvfu.ru/metrics
```

**Ответ:**
```json
{
  "timestamp": "2024-12-19T10:00:00Z",
  "window_minutes": 5,
  "total_requests": 1250,
  "total_errors": 5,
  "error_rate": 0.4,
  "top_endpoints": {
    "GET /api/appeals": {
      "count": 450,
      "errors": 2,
      "avg_duration": 125.5
    }
  }
}
```

---

## ❤️ Health Checks

### Простая проверка

```bash
curl https://api.oss-dvfu.ru/health
```

### Детальная проверка

```bash
curl https://api.oss-dvfu.ru/health/detailed
```

---

## 🔄 Обработка ошибок

### Стандартный формат ошибки

```json
{
  "detail": "Appeal not found",
  "status_code": 404
}
```

### Коды статусов

- `200` - Успешно
- `201` - Создано
- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Не найдено
- `422` - Ошибка валидации
- `429` - Слишком много запросов
- `500` - Внутренняя ошибка сервера

---

## 📝 Примеры на разных языках

### Python

```python
import requests

# Создать обращение
response = requests.post(
    "https://api.oss-dvfu.ru/api/appeals",
    json={
        "title": "Проблема с отоплением",
        "description": "В комнате 101 холодно",
        "contact_type": "email",
        "contact_value": "student@example.com"
    }
)
print(response.json())
```

### JavaScript

```javascript
// Создать обращение
const response = await fetch('https://api.oss-dvfu.ru/api/appeals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Проблема с отоплением',
    description: 'В комнате 101 холодно',
    contact_type: 'email',
    contact_value: 'student@example.com'
  })
});

const data = await response.json();
console.log(data);
```

---

**Готово!** 🚀

