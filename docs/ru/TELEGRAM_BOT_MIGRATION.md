# Миграция на Telegram бот для обращений

**Дата:** 2024-12-19  
**Статус:** 🚧 В процессе

---

## 🎯 Новая архитектура

### До миграции:
- Обращения через сайт (`/appeal`)
- Админ-панель для обработки обращений
- Статистика на сайте

### После миграции:
- ✅ **Обращения через единый Telegram бот**
- ✅ **Сайт только для:**
  - Новости
  - Гайды
  - Контакты
  - Статистика (автоматическая загрузка из бота)

---

## 📋 План миграции

### Этап 1: API для интеграции с ботом ✅

**Задачи:**
- [x] Создать API endpoint для получения статистики от бота
- [x] Создать API endpoint для загрузки отчетов от бота
- [x] Создать API endpoint для синхронизации данных

**Endpoints:**
```
POST /api/bot/stats          - Получение статистики от бота
POST /api/bot/reports        - Загрузка отчетов
GET  /api/bot/sync           - Синхронизация данных
```

---

### Этап 2: Кабинет для членов ОСС ✅

**Задачи:**
- [x] Создать страницу `/manage/stats` для занесения статистики
- [x] Создать форму для ручного ввода данных
- [x] Интеграция с API для сохранения

**Функции:**
- Ручной ввод статистики
- Загрузка отчетов
- Просмотр истории изменений

---

### Этап 3: Обновление главной страницы ✅

**Задачи:**
- [x] Убрать форму подачи обращений
- [x] Добавить информацию о Telegram боте
- [x] Добавить ссылку на бота

**Изменения:**
- Заменить форму обращений на информацию о боте
- Добавить кнопку "Подать обращение через бот"

---

### Этап 4: Страница статистики ✅

**Задачи:**
- [x] Создать страницу `/statistics` с автообновлением
- [x] Интеграция с API бота
- [x] Автоматическое обновление каждые 5 минут

**Функции:**
- Отображение статистики обращений
- Графики и диаграммы
- Автообновление данных

---

### Этап 5: Скрытие страниц обращений ✅

**Задачи:**
- [x] Скрыть `/appeal` (или перенаправить на бота)
- [x] Оставить `/appeal/status` для проверки по токену
- [x] Обновить навигацию

---

## 🔧 Технические детали

### API для бота

**Формат данных:**

```typescript
// Статистика от бота
interface BotStats {
  total: number;
  by_status: {
    new: number;
    in_progress: number;
    waiting: number;
    closed: number;
  };
  by_direction: Record<string, number>;
  created_today: number;
  closed_today: number;
  timestamp: string;
}

// Отчет от бота
interface BotReport {
  period: string; // "2024-12" или "2024-12-19"
  stats: BotStats;
  details?: any;
}
```

### Кабинет для членов ОСС

**Доступ:**
- Только авторизованные пользователи
- Роль: `member`, `lead`, `board`, `staff`

**Функции:**
- Ввод статистики вручную
- Загрузка CSV/Excel отчетов
- Просмотр истории

---

## 📊 Структура данных

### Таблица статистики

```sql
CREATE TABLE IF NOT EXISTS statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period DATE NOT NULL, -- Дата периода (например, 2024-12-19)
  source TEXT NOT NULL, -- 'bot' или 'manual'
  data JSONB NOT NULL, -- Статистика в формате JSON
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(period, source)
);
```

---

## 🔄 Процесс работы

### Автоматическая загрузка от бота:

1. Бот отправляет статистику на `/api/bot/stats`
2. API сохраняет данные в БД
3. Сайт автоматически обновляет страницу статистики

### Ручной ввод членами ОСС:

1. Член ОСС заходит в `/manage/stats`
2. Вводит данные в форму
3. Сохраняет через API
4. Данные отображаются на сайте

---

## 🚀 Реализация

### 1. API Endpoints

**Файлы:**
- `frontend/nextjs/app/api/bot/stats/route.ts`
- `frontend/nextjs/app/api/bot/reports/route.ts`
- `frontend/nextjs/app/api/bot/sync/route.ts`

### 2. Кабинет для членов ОСС

**Файлы:**
- `frontend/nextjs/app/manage/stats/page.tsx`
- `frontend/nextjs/app/manage/stats/edit/page.tsx`

### 3. Обновление главной страницы

**Файлы:**
- `frontend/nextjs/app/page.tsx`

### 4. Страница статистики

**Файлы:**
- `frontend/nextjs/app/statistics/page.tsx` (уже существует, нужно обновить)

---

## ✅ Чеклист миграции

- [x] Создать план миграции
- [ ] Создать API endpoints для бота
- [ ] Создать кабинет для членов ОСС
- [ ] Обновить главную страницу
- [ ] Обновить страницу статистики
- [ ] Скрыть страницы обращений
- [ ] Обновить документацию
- [ ] Тестирование

---

## 📚 Документация для бота

### Интеграция бота с сайтом

**1. Отправка статистики:**

```python
import requests

stats = {
    "total": 150,
    "by_status": {
        "new": 20,
        "in_progress": 15,
        "waiting": 10,
        "closed": 105
    },
    "by_direction": {
        "legal": 50,
        "infrastructure": 40,
        "scholarship": 30,
        "international": 30
    },
    "created_today": 5,
    "closed_today": 8,
    "timestamp": "2024-12-19T12:00:00Z"
}

response = requests.post(
    "https://your-site.com/api/bot/stats",
    json=stats,
    headers={"Authorization": f"Bearer {BOT_API_KEY}"}
)
```

**2. Отправка отчета:**

```python
report = {
    "period": "2024-12-19",
    "stats": stats,
    "details": {...}
}

response = requests.post(
    "https://your-site.com/api/bot/reports",
    json=report,
    headers={"Authorization": f"Bearer {BOT_API_KEY}"}
)
```

---

## 🔒 Безопасность

### API ключ для бота:

- Создать отдельный API ключ для бота
- Хранить в переменных окружения бота
- Проверять в API endpoints

**Переменная окружения:**
```env
BOT_API_KEY=your-secret-api-key
```

---

## 📝 Итог

**Новая архитектура:**
- ✅ Обращения через Telegram бот
- ✅ Сайт для новостей, гайдов, контактов
- ✅ Статистика автоматически загружается
- ✅ Члены ОСС могут вносить данные вручную

**Преимущества:**
- Единая точка входа для обращений
- Удобство для студентов (Telegram)
- Автоматизация статистики
- Гибкость (ручной ввод + автоматика)

