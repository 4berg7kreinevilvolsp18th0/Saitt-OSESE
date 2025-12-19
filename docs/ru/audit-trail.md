# История изменений обращений (Audit Trail)

## Обзор

Система автоматически записывает все изменения обращений в таблицу `appeal_history`. Это позволяет:
- Отслеживать, кто и когда изменил статус
- Видеть историю назначений ответственных
- Анализировать работу команды
- Разрешать конфликты

## Установка

### Шаг 1: Создание таблицы

Выполните SQL скрипт в Supabase:

1. Откройте **Supabase Dashboard** → **SQL Editor**
2. Откройте файл `database/schema_audit.sql`
3. Скопируйте весь код
4. Вставьте в SQL Editor и нажмите **"Run"**

Это создаст:
- Таблицу `appeal_history`
- Индексы для быстрого поиска
- Триггер для автоматического логирования
- RLS политики

### Шаг 2: Проверка

Проверьте, что триггер работает:

```sql
-- Измените статус обращения
UPDATE appeals 
SET status = 'in_progress' 
WHERE id = 'some-appeal-id';

-- Проверьте историю
SELECT * FROM appeal_history 
WHERE appeal_id = 'some-appeal-id' 
ORDER BY created_at DESC;
```

## Что логируется

### Автоматически (через триггер)

1. **Изменение статуса**
   - Старый статус → Новый статус
   - Автоматически при UPDATE

2. **Изменение приоритета**
   - Старый приоритет → Новый приоритет

3. **Назначение ответственного**
   - Старый ответственный → Новый ответственный

4. **Установка дедлайна**
   - Старый дедлайн → Новый дедлайн

### Вручную (через API)

Можно добавить записи вручную для других действий:
- Добавление комментария
- Изменение тегов
- Другие кастомные действия

## Использование в коде

### Просмотр истории в админ-панели

История автоматически отображается в компоненте `AppealCard`:
- Нажмите "История" на карточке обращения
- Просмотрите все изменения

### API endpoint

```bash
GET /api/appeals/{id}/history
```

Возвращает:
```json
{
  "history": [
    {
      "id": "...",
      "action": "status_changed",
      "description": "Статус изменён с new на in_progress",
      "old_value": "new",
      "new_value": "in_progress",
      "created_at": "2024-01-15T10:30:00Z",
      "changed_by": "user-uuid"
    }
  ],
  "count": 1
}
```

### Добавление записи вручную

```typescript
await supabase
  .from('appeal_history')
  .insert({
    appeal_id: appealId,
    changed_by: userId,
    action: 'comment_added',
    description: 'Добавлен комментарий',
    new_value: commentId,
  });
```

## Типы действий

- `status_changed` - Изменение статуса
- `assigned` - Назначение ответственного
- `priority_changed` - Изменение приоритета
- `deadline_set` - Установка дедлайна
- `comment_added` - Добавление комментария
- `tag_added` - Добавление тега
- `attachment_added` - Добавление вложения

## RLS политики

История доступна только:
- Членам ОСС (member, lead, board, staff)
- В рамках их направления (для member/lead)
- Всем для board/staff

Студенты не могут видеть историю (только текущий статус по токену).

## Аналитика

### Статистика по действиям

```sql
SELECT 
  action,
  COUNT(*) as count
FROM appeal_history
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY action
ORDER BY count DESC;
```

### Время до первого ответа

```sql
SELECT 
  appeal_id,
  created_at as appeal_created,
  MIN(created_at) FILTER (WHERE action = 'status_changed' AND new_value = 'in_progress') as first_response
FROM appeal_history
GROUP BY appeal_id, created_at;
```

### Нагрузка по пользователям

```sql
SELECT 
  changed_by,
  COUNT(*) as actions_count
FROM appeal_history
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY changed_by
ORDER BY actions_count DESC;
```

## Очистка старых записей

Для экономии места можно периодически архивировать старые записи:

```sql
-- Архивировать записи старше 1 года
CREATE TABLE appeal_history_archive AS
SELECT * FROM appeal_history
WHERE created_at < NOW() - INTERVAL '1 year';

-- Удалить архивированные записи
DELETE FROM appeal_history
WHERE created_at < NOW() - INTERVAL '1 year';
```

## Troubleshooting

**История не создаётся:**
- Проверьте, что триггер создан: `\df log_appeal_change`
- Проверьте, что RLS разрешает INSERT
- Проверьте логи Supabase

**Ошибка "permission denied":**
- Убедитесь, что пользователь имеет роль member/lead/board/staff
- Проверьте RLS политики

**Медленные запросы:**
- Убедитесь, что индексы созданы
- Используйте LIMIT для больших списков
- Рассмотрите пагинацию

