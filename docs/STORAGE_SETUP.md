# Настройка Supabase Storage для вложений

## Создание bucket для файлов обращений

1. Зайдите в **Supabase Dashboard** → **Storage**
2. Нажмите **"New bucket"**
3. Заполните форму:
   - **Name:** `appeal-attachments`
   - **Public bucket:** ✅ Включите (чтобы файлы были доступны по публичным URL)
   - **File size limit:** 10 MB (или больше, если нужно)
   - **Allowed MIME types:** (оставьте пустым для всех типов, или укажите: `image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
4. Нажмите **"Create bucket"**

## Настройка политик доступа (RLS)

После создания bucket нужно настроить политики:

1. Перейдите в **Storage** → **Policies** → выберите bucket `appeal-attachments`
2. Создайте политику для загрузки (INSERT):
   - **Policy name:** `Allow public uploads for appeals`
   - **Allowed operation:** INSERT
   - **Policy definition:**
   ```sql
   (bucket_id = 'appeal-attachments')
   ```
   - **Check expression:** (оставьте пустым)

3. Создайте политику для чтения (SELECT):
   - **Policy name:** `Allow public reads`
   - **Allowed operation:** SELECT
   - **Policy definition:**
   ```sql
   (bucket_id = 'appeal-attachments')
   ```

## Альтернативный вариант: через SQL

Выполните в **SQL Editor**:

```sql
-- Создание bucket (если еще не создан)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'appeal-attachments',
  'appeal-attachments',
  true,
  10485760, -- 10MB в байтах
  ARRAY['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Политика для загрузки
CREATE POLICY "Allow public uploads for appeals"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'appeal-attachments');

-- Политика для чтения
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'appeal-attachments');
```

## Проверка

1. Попробуйте загрузить файл через форму обращения
2. Проверьте в **Storage** → **appeal-attachments**, что файл появился
3. Проверьте, что файл доступен по публичному URL

## Ограничения

- Максимальный размер файла: 10MB (можно изменить в настройках bucket)
- Максимальное количество файлов на обращение: 5 (настраивается в компоненте)
- Разрешенные типы: изображения, PDF, документы Word

## Безопасность

⚠️ **Важно:** Bucket публичный, но файлы хранятся в папках по ID обращения, что обеспечивает некоторую изоляцию. В будущем можно добавить:
- Проверку токена обращения для доступа к файлам
- Ограничение доступа только для автора обращения и членов ОСС

