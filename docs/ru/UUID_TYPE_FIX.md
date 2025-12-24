# Исправление ошибок типов UUID

## Проблема

Ошибка: `operator does not exist: uuid = text`

Это происходит, когда PostgreSQL пытается сравнить колонку типа UUID с текстовым значением без явного приведения типов.

## Причина

Функция `auth.uid()` в некоторых контекстах может возвращать `text` вместо `uuid`, что вызывает ошибку при сравнении с UUID колонками.

## Решение

Добавлено явное приведение типов `::uuid` во всех местах, где используется `auth.uid()`.

### Было:
```sql
WHERE user_id = auth.uid()
```

### Стало:
```sql
WHERE user_id = (SELECT auth.uid())::uuid
```

## Исправленные файлы

1. ✅ `database/migrations/fix_security_issues.sql` - все RLS политики
2. ✅ `database/migrations/add_content_protection.sql` - функции логирования
3. ✅ `database/migrations/add_2fa_support.sql` - политики 2FA
4. ✅ `database/migrations/add_security_logging.sql` - политики логирования
5. ✅ `database/schema.sql` - функция has_role
6. ✅ `database/migrations/fix_uuid_type_errors.sql` - новый файл с исправлениями

## Как применить исправления

### Вариант 1: Выполнить новую миграцию

Выполните в Supabase SQL Editor:

```sql
-- Откройте файл database/migrations/fix_uuid_type_errors.sql
-- Скопируйте и выполните весь код
```

Это исправит все проблемные места.

### Вариант 2: Ручное исправление

Если знаете конкретное место ошибки, добавьте `::uuid`:

```sql
-- Было
WHERE user_id = auth.uid()

-- Стало
WHERE user_id = (SELECT auth.uid())::uuid
```

## Проверка

После применения исправлений проверьте:

```sql
-- Проверить функции
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname IN ('log_content_action', 'safe_delete_content', 'has_role');

-- Проверить политики
SELECT schemaname, tablename, policyname, qual 
FROM pg_policies 
WHERE qual LIKE '%auth.uid%';
```

Все использования `auth.uid()` должны быть с `::uuid`.

## Примеры исправлений

### RLS Политики

```sql
-- ❌ Неправильно
CREATE POLICY "test" ON table_name
  FOR SELECT USING (user_id = auth.uid());

-- ✅ Правильно
CREATE POLICY "test" ON table_name
  FOR SELECT USING (user_id = (SELECT auth.uid())::uuid);
```

### Функции

```sql
-- ❌ Неправильно
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
END;

-- ✅ Правильно
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := (SELECT auth.uid())::uuid;
END;
```

### JOIN'ы

```sql
-- ❌ Неправильно
SELECT * FROM user_roles
WHERE user_id = auth.uid();

-- ✅ Правильно
SELECT * FROM user_roles
WHERE user_id = (SELECT auth.uid())::uuid;
```

## Готово! ✅

После выполнения миграции `fix_uuid_type_errors.sql` все ошибки типов должны быть исправлены.

