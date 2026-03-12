# Кэширование

**Дата:** 2024-12-19  
**Статус:** ✅ Реализовано

---

## 🎯 Обзор

Кэширование реализовано с использованием Redis для повышения производительности API.

### Что кэшируется:

1. **Directions (Направления)** - TTL: 1 час
   - Список направлений
   - Отдельное направление по ID/slug

2. **Content (Контент)** - TTL: 30 минут
   - Контент по slug (только опубликованный)

3. **Statistics (Статистика)** - TTL: 15 минут
   - Статистика обращений
   - Аналитика

---

## 🔧 Backend (Python)

### Модуль кэширования

**Файл:** `backend/python/cache.py`

**Основные функции:**

```python
from cache import get_cache, set_cache, delete_cache

# Получить из кэша
cached_value = get_cache("cache_key")

# Сохранить в кэш
set_cache("cache_key", value, ttl=3600)  # TTL в секундах

# Удалить из кэша
delete_cache("cache_key")

# Инвалидация по паттерну
invalidate_pattern("directions:*")
```

### Использование в endpoints

```python
@app.get("/api/directions")
def get_directions(...):
    # Проверка кэша
    cache_key = cache_directions_key(active_only=True)
    cached = get_cache(cache_key)
    if cached:
        return cached
    
    # Получение из БД
    directions = crud.get_directions(...)
    
    # Сохранение в кэш
    set_cache(cache_key, directions, ttl=3600)
    return directions
```

### Инвалидация кэша

При изменении данных кэш автоматически инвалидируется:

```python
@app.post("/api/content")
def create_content(...):
    content = crud.create_content(...)
    # Инвалидация кэша
    invalidate_content_cache()
    return content
```

---

## 🎨 Frontend (Next.js)

### Redis клиент

**Файл:** `frontend/nextjs/lib/redis.ts`

Уже используется для:
- Rate limiting
- Блокировка IP

Можно расширить для кэширования API ответов.

---

## ⚙️ Настройка

### Backend

**Переменные окружения:**

```env
REDIS_URL=redis://user:password@host:port
# или
REDIS_URL=redis://localhost:6379
```

**Fallback:**
- Если Redis недоступен, кэширование отключается
- API продолжает работать без кэша

### Frontend

**Upstash Redis (рекомендуется):**

```env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

**Обычный Redis:**

```env
REDIS_URL=redis://...
```

---

## 📊 TTL (Time To Live)

### Directions:
- **Список:** 1 час (3600 сек)
- **Отдельное:** 1 час (3600 сек)

### Content:
- **По slug:** 30 минут (1800 сек)
- Только опубликованный контент кэшируется

### Statistics:
- **Статистика:** 15 минут (900 сек)
- **Аналитика:** 10 минут (600 сек)

---

## 🔄 Инвалидация кэша

### Автоматическая инвалидация:

1. **При создании:**
   - `create_content()` → инвалидирует весь content cache
   - `create_direction()` → инвалидирует directions cache

2. **При обновлении:**
   - `update_content()` → инвалидирует конкретный content
   - `update_direction()` → инвалидирует конкретное direction

3. **При удалении:**
   - Инвалидируется соответствующий кэш

### Ручная инвалидация:

```python
from cache import invalidate_directions_cache, invalidate_content_cache

# Инвалидировать все направления
invalidate_directions_cache()

# Инвалидировать конкретное направление
invalidate_direction_cache(direction_id="...", slug="...")

# Инвалидировать весь контент
invalidate_content_cache()

# Инвалидировать статистику
invalidate_stats_cache()
```

---

## 🎯 Стратегия кэширования

### Что кэшировать:

✅ **Кэшировать:**
- Directions (редко меняются)
- Опубликованный контент
- Статистика (меняется редко)
- Списки (с общими параметрами)

❌ **Не кэшировать:**
- Обращения (часто меняются)
- Пользовательские данные
- Результаты поиска (динамические)
- Данные с фильтрами (слишком много вариантов)

### Ключи кэша:

Формат: `prefix:param1:param2:...`

Примеры:
- `directions:active_only:True`
- `direction:id:123e4567-...`
- `direction:slug:legal`
- `content:slug:my-article`

---

## 📈 Производительность

### Ожидаемые улучшения:

- **Directions:** ускорение в 10-50 раз
- **Content:** ускорение в 5-20 раз
- **Statistics:** ускорение в 3-10 раз

### Метрики:

Кэш добавляет заголовки:
- `X-Cache: HIT` - данные из кэша
- `X-Cache: MISS` - данные из БД

---

## 🐛 Отладка

### Проверка кэша:

```python
from cache import get_redis_client

client = get_redis_client()
if client:
    # Получить все ключи
    keys = client.keys("directions:*")
    print(keys)
    
    # Получить значение
    value = client.get("directions:active_only:True")
    print(value)
```

### Логирование:

Кэш логирует:
- Cache hits/misses
- Ошибки подключения
- Инвалидацию

---

## 🔒 Безопасность

### Изоляция данных:

- Кэш не содержит чувствительных данных
- Пользовательские данные не кэшируются
- Кэш доступен только для чтения через API

### TTL:

- Автоматическое истечение через TTL
- Ручная инвалидация при изменениях
- Защита от устаревших данных

---

## 📚 Примеры

### Backend:

```python
# Кэширование списка направлений
@app.get("/api/directions")
def get_directions(active_only: bool = True, ...):
    cache_key = cache_directions_key(active_only=active_only)
    cached = get_cache(cache_key)
    if cached:
        return cached
    
    directions = crud.get_directions(...)
    set_cache(cache_key, directions, ttl=3600)
    return directions
```

### Инвалидация:

```python
@app.post("/api/content")
def create_content(...):
    content = crud.create_content(...)
    # Инвалидировать кэш
    invalidate_content_cache()
    return content
```

---

## ✅ Итог

Кэширование реализовано для:
- ✅ Directions (1 час TTL)
- ✅ Content (30 минут TTL)
- ✅ Автоматическая инвалидация
- ✅ Fallback при недоступности Redis

**Производительность улучшена!** 🚀

