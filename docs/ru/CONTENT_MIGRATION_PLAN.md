# План миграции контента из Supabase в файловую систему

## Проблема

Новости и гайды хранятся в Supabase и занимают место в БД. Нужно:
- ✅ Освободить место в Supabase
- ✅ Сделать контент редактируемым через файлы
- ✅ Защита от удаления (Git версионирование)
- ✅ Админ-панель для управления

## Решение: Markdown файлы в репозитории

### Структура

```
frontend/nextjs/
  content/
    news/
      2024-01-15-kak-poluchit-stipendiyu.md
      2024-01-20-novye-pravila-obshagiya.md
    guides/
      kak-podat-apellyaciyu.md
      dokumenty-dlya-stipendii.md
    faq/
      chastye-voprosy.md
```

### Формат файла

```markdown
---
title: "Как получить стипендию"
slug: "kak-poluchit-stipendiyu"
type: "news"
direction: "scholarship"
status: "published"
publishedAt: "2024-01-15T10:00:00Z"
author: "Иван Иванов"
---

# Как получить стипендию

Текст новости в Markdown формате...
```

## Архитектура

### 1. Хранение

- **Файлы:** `frontend/nextjs/content/` (в Git)
- **Метаданные:** Frontmatter в каждом файле
- **Изображения:** `public/content-images/` (в Git)

### 2. API

```typescript
// Чтение контента
GET /api/content/[slug]
GET /api/content?type=news&direction=scholarship

// Создание/обновление (только для админов)
POST /api/admin/content
PUT /api/admin/content/[slug]
DELETE /api/admin/content/[slug] (soft delete)
```

### 3. Админ-панель

- Редактор Markdown с preview
- Загрузка изображений
- Управление статусами (draft/published)
- История изменений (через Git)

## Преимущества

1. ✅ **Бесплатно** - файлы в Git, не занимают место в Supabase
2. ✅ **Версионирование** - вся история в Git
3. ✅ **Бэкапы** - автоматически в репозитории
4. ✅ **Защита от удаления** - можно восстановить из Git
5. ✅ **Простота** - редактирование через файлы или админ-панель

## План миграции

### Этап 1: Создание структуры

1. Создать папку `frontend/nextjs/content/`
2. Создать подпапки: `news/`, `guides/`, `faq/`
3. Настроить чтение файлов в API

### Этап 2: Экспорт из Supabase

1. Создать скрипт для экспорта контента
2. Конвертировать в Markdown файлы
3. Сохранить в правильную структуру

### Этап 3: Обновление API

1. Изменить API для чтения из файлов
2. Обновить компоненты для работы с новой системой
3. Сохранить обратную совместимость

### Этап 4: Админ-панель

1. Создать редактор Markdown
2. Добавить загрузку изображений
3. Добавить управление статусами

### Этап 5: Защита

1. Soft delete (файл не удаляется, только помечается)
2. Логирование всех действий
3. Git commit для каждого изменения

## Реализация

### Чтение контента

```typescript
// lib/content.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getContent(slug: string) {
  const files = [
    path.join(process.cwd(), 'content', 'news', `${slug}.md`),
    path.join(process.cwd(), 'content', 'guides', `${slug}.md`),
    path.join(process.cwd(), 'content', 'faq', `${slug}.md`),
  ];

  for (const filePath of files) {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      return {
        ...data,
        body: content,
      };
    }
  }

  return null;
}
```

### Создание/обновление контента

```typescript
// app/api/admin/content/route.ts
import { writeFile } from 'fs/promises';
import matter from 'gray-matter';

export async function POST(request: Request) {
  // Проверка прав доступа
  const user = await getCurrentUser();
  if (!user || !isAdmin(user)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, slug, type, body, direction, status } = await request.json();

  // Формируем frontmatter
  const frontmatter = {
    title,
    slug,
    type,
    direction: direction || null,
    status,
    publishedAt: status === 'published' ? new Date().toISOString() : null,
    author: user.email,
  };

  // Формируем содержимое файла
  const content = matter.stringify(body, frontmatter);

  // Определяем путь
  const dir = path.join(process.cwd(), 'content', type);
  const filePath = path.join(dir, `${slug}.md`);

  // Сохраняем файл
  await writeFile(filePath, content, 'utf-8');

  // Git commit (опционально, через GitHub API или локально)
  await commitToGit(filePath, `Add/update content: ${title}`);

  return Response.json({ success: true });
}
```

### Soft Delete

```typescript
// Вместо удаления файла, добавляем в frontmatter
const frontmatter = {
  ...existingFrontmatter,
  status: 'deleted',
  deletedAt: new Date().toISOString(),
  deletedBy: user.email,
};

// Файл остается, но не показывается
```

## Защита от "предателя"

### 1. Git версионирование

- Все изменения коммитятся в Git
- Можно восстановить из истории
- Невозможно удалить историю без доступа к репозиторию

### 2. Логирование

- Все действия логируются в БД
- Невозможно удалить логи без прав администратора БД

### 3. Бэкапы

- Автоматические бэкапы через GitHub
- Можно настроить внешние бэкапы

### 4. Права доступа

- Только определенные пользователи могут удалять
- Двухфакторная аутентификация для админов
- Логирование всех действий

## Миграция существующих данных

```typescript
// scripts/migrate-content.ts
import { supabase } from '../lib/supabaseClient';
import { writeFile } from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

async function migrateContent() {
  // Получаем весь контент из Supabase
  const { data: content } = await supabase
    .from('content')
    .select('*')
    .eq('status', 'published');

  for (const item of content || []) {
    // Формируем frontmatter
    const frontmatter = {
      title: item.title,
      slug: item.slug,
      type: item.type,
      direction: item.direction_id || null,
      status: item.status,
      publishedAt: item.published_at,
    };

    // Формируем файл
    const content = matter.stringify(item.body, frontmatter);

    // Сохраняем
    const dir = path.join(process.cwd(), 'content', item.type);
    const filePath = path.join(dir, `${item.slug}.md`);
    await writeFile(filePath, content, 'utf-8');
  }
}
```

## UI Админ-панели

### Редактор

```typescript
// app/admin/content/editor/page.tsx
<ContentEditor>
  <MarkdownEditor 
    value={content}
    onChange={setContent}
  />
  <Preview content={content} />
  <MetadataForm 
    title={title}
    slug={slug}
    type={type}
    direction={direction}
    status={status}
  />
  <ImageUpload />
  <SaveButton onClick={saveContent} />
</ContentEditor>
```

## Следующие шаги

1. ✅ Создать структуру папок
2. ✅ Написать функции чтения/записи
3. ✅ Создать API endpoints
4. ✅ Мигрировать существующий контент
5. ✅ Создать админ-панель
6. ✅ Добавить защиту и логирование

