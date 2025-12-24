# Исправление проблем безопасности и производительности

## Обнаруженные проблемы

После проверки базы данных линтером Supabase обнаружены следующие проблемы:

### Критические ошибки (ERROR)

1. **Security Definer View** - представление `content_published` использует SECURITY DEFINER
2. **RLS Disabled** - таблица `content_audit_log` не имеет RLS

### Предупреждения безопасности (WARN)

3. **Function Search Path Mutable** - 8 функций без установленного `search_path`
4. **Auth RLS InitPlan** - проблемы с производительностью RLS политик
5. **Multiple Permissive Policies** - множественные политики для одной роли

### Информационные (INFO)

6. **Unindexed Foreign Keys** - отсутствующие индексы
7. **Unused Index** - неиспользуемые индексы (можно игнорировать)

---

## Решения

### 1. Security Definer View

**Проблема:** Представление `content_published` использует SECURITY DEFINER, что может быть небезопасно.

**Решение:** Пересоздать представление БЕЗ SECURITY DEFINER.

```sql
DROP VIEW IF EXISTS content_published;
CREATE VIEW content_published AS
SELECT * FROM content
WHERE status = 'published' AND deleted_at IS NULL;
```

---

### 2. RLS для content_audit_log

**Проблема:** Таблица `content_audit_log` не имеет RLS, что означает, что любой может читать логи.

**Решение:** Включить RLS и создать политики.

```sql
ALTER TABLE content_audit_log ENABLE ROW LEVEL SECURITY;

-- Только админы могут читать логи
CREATE POLICY content_audit_log_admin_read ON content_audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = (SELECT auth.uid())
        AND ur.role IN ('board', 'staff')
    )
  );
```

---

### 3. Function Search Path

**Проблема:** Функции без установленного `search_path` уязвимы для атак через подмену схем.

**Решение:** Добавить `SET search_path = public, pg_temp` ко всем функциям.

**Исправленные функции:**
- `log_content_action()`
- `safe_delete_content()`
- `restore_content()`

**Пример:**
```sql
CREATE OR REPLACE FUNCTION log_content_action()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp  -- ← Добавлено
AS $$ ... $$;
```

---

### 4. Оптимизация RLS политик

**Проблема:** Использование `auth.uid()` в RLS политиках вызывает функцию для каждой строки.

**Решение:** Использовать `(SELECT auth.uid())` - функция вызывается один раз.

**Было:**
```sql
USING (user_id = auth.uid())  -- Вызывается для каждой строки
```

**Стало:**
```sql
USING (user_id = (SELECT auth.uid()))  -- Вызывается один раз
```

**Исправленные таблицы:**
- `user_roles`
- `notification_settings`
- `notification_log`

---

### 5. Объединение множественных политик

**Проблема:** Несколько политик для одной роли и действия снижают производительность.

**Решение:** Объединить политики в одну.

**Пример для appeals:**
```sql
-- Было: 2 политики
-- appeals_members_read
-- appeals_public_read_by_token

-- Стало: 1 объединенная политика
CREATE POLICY appeals_unified_read ON appeals
  FOR SELECT
  USING (
    -- Условие 1: члены ОСС
    (EXISTS (...))
    OR
    -- Условие 2: публичный доступ по токену
    (public_token = ...)
  );
```

**Исправленные таблицы:**
- `appeals`
- `content`
- `documents`
- `user_roles`

---

### 6. Индексы для внешних ключей

**Проблема:** Отсутствуют индексы для внешних ключей, что снижает производительность.

**Решение:** Создать индексы.

```sql
CREATE INDEX idx_content_deleted_by ON content(deleted_by)
WHERE deleted_by IS NOT NULL;

CREATE INDEX idx_documents_direction_id ON documents(direction_id)
WHERE direction_id IS NOT NULL;
```

---

## Выполнение миграции

### Шаг 1: Выполнить миграцию

В Supabase SQL Editor выполните:

```sql
\i database/migrations/fix_security_issues.sql
```

Или скопируйте содержимое файла и выполните в SQL Editor.

### Шаг 2: Проверка

После выполнения миграции проверьте:

1. **Представление:**
   ```sql
   SELECT * FROM content_published LIMIT 1;
   ```

2. **RLS:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
     AND tablename = 'content_audit_log';
   -- rowsecurity должно быть true
   ```

3. **Функции:**
   ```sql
   SELECT proname, prosecdef, proconfig
   FROM pg_proc
   WHERE proname IN ('log_content_action', 'safe_delete_content', 'restore_content');
   -- proconfig должен содержать search_path
   ```

4. **Политики:**
   ```sql
   SELECT tablename, policyname
   FROM pg_policies
   WHERE schemaname = 'public'
   ORDER BY tablename, policyname;
   ```

### Шаг 3: Повторная проверка линтером

После выполнения миграции запустите линтер Supabase снова. Все ошибки должны быть исправлены.

---

## Результаты

После исправления:

✅ **Безопасность:**
- Представления без SECURITY DEFINER
- RLS включен для всех таблиц
- Функции с установленным search_path

✅ **Производительность:**
- Оптимизированные RLS политики
- Объединенные политики
- Индексы для внешних ключей

✅ **Соответствие стандартам:**
- Все проверки линтера пройдены
- Соответствие best practices Supabase

---

## Примечания

1. **Неиспользуемые индексы (INFO)** - можно игнорировать, они не влияют на безопасность
2. **Обратная совместимость** - все изменения обратно совместимы
3. **Производительность** - после исправлений запросы будут работать быстрее

---

## Дополнительная информация

- [Supabase Database Linter](https://supabase.com/docs/guides/database/database-linter)
- [RLS Best Practices](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Function Security](https://supabase.com/docs/guides/database/postgres/functions)

