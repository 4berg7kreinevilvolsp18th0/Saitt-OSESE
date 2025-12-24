# Оптимизация хранения файлов

## Проблема

Студенты прикрепляют много файлов, и бесплатное хранилище (1GB в Supabase) быстро заканчивается.

## Решения

### 1. Сжатие файлов перед загрузкой ⭐

**Для изображений:**

```typescript
// Установите библиотеку
npm install browser-image-compression

// В компоненте загрузки
import imageCompression from 'browser-image-compression';

async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // Максимальный размер после сжатия
    maxWidthOrHeight: 1920, // Максимальное разрешение
    useWebWorker: true,
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Ошибка сжатия:', error);
    return file; // Возвращаем оригинал, если не удалось сжать
  }
}
```

**Экономия:** Изображения уменьшаются в 5-10 раз!

---

### 2. Автоматическое удаление старых файлов

**Создайте SQL функцию:**

```sql
-- Удаление файлов обращений старше 1 года
CREATE OR REPLACE FUNCTION cleanup_old_attachments()
RETURNS void AS $$
BEGIN
  -- Удаляем записи из БД
  DELETE FROM appeal_attachments
  WHERE appeal_id IN (
    SELECT id FROM appeals 
    WHERE closed_at IS NOT NULL 
      AND closed_at < NOW() - INTERVAL '1 year'
  );
  
  -- Файлы в Storage нужно удалить отдельно через API
END;
$$ LANGUAGE plpgsql;

-- Запускать раз в месяц (через pg_cron или внешний скрипт)
```

**Настройка автоматического запуска:**

```sql
-- Установите расширение pg_cron (если доступно)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Запускать каждый месяц
SELECT cron.schedule(
  'cleanup-old-files',
  '0 3 1 * *', -- Каждый 1-й день месяца в 3:00
  $$SELECT cleanup_old_attachments()$$
);
```

---

### 3. Ограничение размера и количества файлов

**В коде:**

```typescript
// Максимальный размер файла: 5MB (вместо 10MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Максимальное количество файлов: 3 (вместо 5)
const MAX_FILES = 3;

// Проверка перед загрузкой
if (file.size > MAX_FILE_SIZE) {
  throw new Error('Файл слишком большой. Максимум: 5MB');
}

if (files.length > MAX_FILES) {
  throw new Error(`Максимум ${MAX_FILES} файлов`);
}
```

---

### 4. Использование внешних ссылок для больших файлов

**Для больших файлов (видео, архивы >10MB):**

```typescript
// Вместо загрузки в Supabase, сохраняем только ссылку
interface AppealAttachment {
  file_name: string;
  file_url: string; // Может быть внешняя ссылка
  file_size: number;
  is_external: boolean; // Флаг внешнего файла
}

// Студент может прикрепить ссылку на Google Drive, Dropbox и т.д.
```

**В форме обращения:**

```typescript
// Добавьте поле для внешних ссылок
<input 
  type="url" 
  placeholder="Или вставьте ссылку на файл (Google Drive, Dropbox)"
  onChange={(e) => setExternalUrl(e.target.value)}
/>
```

---

### 5. Миграция на Cloudflare R2 (10GB бесплатно)

**Настройка:**

1. **Создайте аккаунт Cloudflare:**
   - https://www.cloudflare.com/products/r2/

2. **Создайте bucket:**
   - Имя: `oss-dvfu-files`
   - Публичный доступ: Да

3. **Получите ключи:**
   - Account ID
   - Access Key ID
   - Secret Access Key

4. **Установите библиотеку:**
   ```bash
   npm install @aws-sdk/client-s3
   ```

5. **Создайте файл `lib/r2Client.ts`:**
   ```typescript
   import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
   import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

   const s3Client = new S3Client({
     region: 'auto',
     endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
     credentials: {
       accessKeyId: process.env.R2_ACCESS_KEY_ID!,
       secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
     },
   });

   export async function uploadToR2(file: File, path: string) {
     const arrayBuffer = await file.arrayBuffer();
     const buffer = Buffer.from(arrayBuffer);

     const command = new PutObjectCommand({
       Bucket: 'oss-dvfu-files',
       Key: path,
       Body: buffer,
       ContentType: file.type,
     });

     await s3Client.send(command);
     
     // Возвращаем публичный URL
     return `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${path}`;
   }
   ```

6. **Измените `/api/upload/route.ts`:**
   ```typescript
   import { uploadToR2 } from '@/lib/r2Client';

   // Вместо Supabase Storage
   const fileUrl = await uploadToR2(file, fileName);
   ```

7. **Настройте переменные окружения:**
   ```env
   R2_ACCOUNT_ID=your-account-id
   R2_ACCESS_KEY_ID=your-access-key
   R2_SECRET_ACCESS_KEY=your-secret-key
   ```

---

### 6. Гибридное решение (Supabase + R2)

**Стратегия:**
- Маленькие файлы (<1MB) → Supabase Storage
- Большие файлы (>1MB) → Cloudflare R2

```typescript
const MAX_SUPABASE_SIZE = 1 * 1024 * 1024; // 1MB

if (file.size < MAX_SUPABASE_SIZE) {
  // Загружаем в Supabase
  await uploadToSupabase(file);
} else {
  // Загружаем в R2
  await uploadToR2(file);
}
```

---

## Мониторинг использования

### SQL запрос для проверки размера файлов

```sql
-- Размер всех файлов в MB
SELECT 
  SUM(file_size) / 1024.0 / 1024.0 AS total_size_mb,
  COUNT(*) AS file_count,
  AVG(file_size) / 1024.0 / 1024.0 AS avg_size_mb
FROM appeal_attachments;

-- Топ 10 самых больших файлов
SELECT 
  file_name,
  file_size / 1024.0 / 1024.0 AS size_mb,
  uploaded_at
FROM appeal_attachments
ORDER BY file_size DESC
LIMIT 10;

-- Файлы по месяцам
SELECT 
  DATE_TRUNC('month', uploaded_at) AS month,
  COUNT(*) AS file_count,
  SUM(file_size) / 1024.0 / 1024.0 AS total_size_mb
FROM appeal_attachments
GROUP BY month
ORDER BY month DESC;
```

---

## Рекомендации

1. ✅ **Всегда сжимайте изображения** перед загрузкой
2. ✅ **Ограничьте размер файла** до 5MB
3. ✅ **Ограничьте количество файлов** до 3 на обращение
4. ✅ **Удаляйте старые файлы** автоматически (через год)
5. ✅ **Используйте внешние ссылки** для очень больших файлов
6. ✅ **Мониторьте использование** регулярно

---

## План действий

### Сейчас (Supabase 1GB):
1. ✅ Добавить сжатие изображений
2. ✅ Уменьшить лимит размера до 5MB
3. ✅ Уменьшить лимит количества до 3 файлов
4. ✅ Настроить автоматическое удаление старых файлов

### При росте (если нужно больше места):
1. Добавить Cloudflare R2 (10GB бесплатно)
2. Мигрировать большие файлы на R2
3. Оставить маленькие файлы в Supabase

### В будущем (если проект вырастет):
1. Перейти на платный тариф Supabase ($25/мес = 100GB)
2. Или использовать только R2 (10GB бесплатно + $0.015/GB)

---

## Итоговая экономия

**Без оптимизации:**
- 1000 обращений × 5 файлов × 5MB = 25GB ❌

**С оптимизацией:**
- Сжатие изображений: -80% размера
- Лимит 3 файла: -40% файлов
- Лимит 5MB: -50% размера
- **Итого: 1000 × 3 × 1MB = 3GB** ✅

**Вывод:** Оптимизация позволяет уместить в 1GB Supabase в 8 раз больше данных!

