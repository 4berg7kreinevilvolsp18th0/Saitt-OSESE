# Система хранения файлов с автоматическим удалением

## Концепция

Файлы обращений автоматически удаляются через 24 часа, если ответственный за направление не поставил галочку "Оставить файл".

## Преимущества

1. ✅ **Экономия места** - файлы не накапливаются
2. ✅ **Безопасность** - меньше данных для утечки
3. ✅ **Ответственность** - ответственный должен решить, нужен ли файл
4. ✅ **Время на скачивание** - 24 часа достаточно для скачивания

## Как это работает

### 1. Загрузка файла

Когда студент загружает файл:
- Файл сохраняется в Supabase Storage
- В БД создается запись в `appeal_attachments`
- Автоматически устанавливается `scheduled_deletion_at = uploaded_at + 24 часа`
- `keep_file = false` (по умолчанию)

### 2. Просмотр файла ответственным

Когда ответственный открывает обращение:
- Видит список файлов
- Может скачать файлы
- Может поставить галочку "Оставить файл" для каждого файла

### 3. Автоматическое удаление

Через 24 часа после загрузки:
- Система проверяет файлы с `scheduled_deletion_at <= NOW()`
- Если `keep_file = false` → файл удаляется
- Если `keep_file = true` → файл остается навсегда

## Структура базы данных

```sql
appeal_attachments:
  - id
  - appeal_id
  - file_name
  - file_url
  - file_size
  - mime_type
  - uploaded_at
  - keep_file (boolean) -- НОВОЕ: сохранить файл?
  - reviewed_at -- НОВОЕ: когда просмотрен
  - reviewed_by -- НОВОЕ: кто просмотрел
  - scheduled_deletion_at -- НОВОЕ: когда удалить
  - deleted_at -- НОВОЕ: когда удален
  - deletion_reason -- НОВОЕ: причина удаления
```

## API Endpoints

### Получить файлы обращения

```typescript
GET /api/appeals/[id]/attachments
```

**Ответ:**
```json
{
  "attachments": [
    {
      "id": "uuid",
      "file_name": "document.pdf",
      "file_url": "https://...",
      "file_size": 1024000,
      "uploaded_at": "2024-01-01T12:00:00Z",
      "keep_file": false,
      "scheduled_deletion_at": "2024-01-02T12:00:00Z",
      "time_until_deletion": "23:45:30" // Оставшееся время
    }
  ]
}
```

### Отметить файл для сохранения

```typescript
POST /api/appeals/[id]/attachments/[attachmentId]/keep
```

**Тело запроса:**
```json
{
  "keep": true
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Файл будет сохранен"
}
```

### Автоматическое удаление (cron job)

```typescript
POST /api/cron/cleanup-files
```

**Логика:**
1. Находит файлы с `scheduled_deletion_at <= NOW()` и `keep_file = false`
2. Удаляет файлы из Supabase Storage
3. Обновляет `deleted_at` в БД
4. Логирует удаление

## Настройка автоматического удаления

### Вариант 1: Vercel Cron Jobs

Создайте файл `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-files",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Запускается каждые 6 часов.

### Вариант 2: Supabase Edge Functions

Создайте Edge Function в Supabase:

```typescript
// supabase/functions/cleanup-files/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Находим файлы для удаления
  const { data: files } = await supabase
    .from('appeal_attachments')
    .select('*')
    .lte('scheduled_deletion_at', new Date().toISOString())
    .eq('keep_file', false)
    .is('deleted_at', null)

  // Удаляем файлы
  for (const file of files || []) {
    // Удаляем из Storage
    await supabase.storage
      .from('appeal-attachments')
      .remove([file.file_url.split('/').pop()])

    // Обновляем БД
    await supabase
      .from('appeal_attachments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', file.id)
  }

  return new Response(JSON.stringify({ deleted: files?.length || 0 }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

## UI Компоненты

### Список файлов с галочкой

```typescript
<FileList appealId={appealId}>
  {attachments.map(file => (
    <FileItem key={file.id}>
      <DownloadButton file={file} />
      <KeepFileCheckbox 
        file={file}
        checked={file.keep_file}
        onChange={(keep) => updateKeepFile(file.id, keep)}
      />
      <DeletionTimer scheduledAt={file.scheduled_deletion_at} />
    </FileItem>
  ))}
</FileList>
```

### Таймер до удаления

```typescript
function DeletionTimer({ scheduledAt }: { scheduledAt: string }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(scheduledAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(scheduledAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [scheduledAt]);

  return (
    <div className="text-sm text-yellow-500">
      Удаление через: {timeLeft}
    </div>
  );
}
```

## Безопасность

1. ✅ Только ответственные за направление могут ставить галочку "Оставить"
2. ✅ Логирование всех действий с файлами
3. ✅ Автоматическое удаление через 24 часа
4. ✅ Невозможно восстановить удаленный файл (если не помечен для сохранения)

## Миграция

Выполните миграцию:

```sql
-- В Supabase SQL Editor
\i database/migrations/add_file_retention.sql
```

## Тестирование

1. Загрузите тестовый файл
2. Проверьте, что `scheduled_deletion_at` установлен на +24 часа
3. Поставьте галочку "Оставить"
4. Проверьте, что `scheduled_deletion_at` стал NULL
5. Снимите галочку
6. Проверьте, что `scheduled_deletion_at` снова установлен

