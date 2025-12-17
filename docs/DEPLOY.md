# Инструкция по деплою проекта ОСС ДВФУ

## Подготовка к деплою

### 1. Создание репозитория на GitHub

1. Создайте новый репозиторий на GitHub (public или private)
2. Инициализируйте git в проекте:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Перейдите в SQL Editor
3. Выполните файлы в порядке:
   - `database/schema.sql` - создаст таблицы и RLS политики
   - `database/analytics.sql` - создаст таблицы для статистики
   - `database/roles_documentation.sql` - документация (не выполнять, только для справки)
   - `database/seed.sql` - (опционально) тестовые данные

4. Включите Authentication в настройках проекта
5. Создайте пользователей через Authentication → Users

### 3. Настройка Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "Add New Project"
4. Импортируйте ваш репозиторий
5. Настройте проект:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend/nextjs`
   - **Build Command:** `npm run build` (или оставьте по умолчанию)
   - **Output Directory:** `.next` (или оставьте по умолчанию)

6. Добавьте переменные окружения:
   - `NEXT_PUBLIC_SUPABASE_URL` - URL вашего Supabase проекта
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - анонимный ключ Supabase
   - `NEXT_PUBLIC_SITE_URL` - URL вашего сайта (например: `https://oss-dvfu.vercel.app`)

7. Нажмите "Deploy"

### 4. Настройка домена (опционально)

1. В Vercel Dashboard перейдите в Settings → Domains
2. Добавьте ваш домен
3. Следуйте инструкциям по настройке DNS

## Настройка для Google Search

### 1. Google Search Console

1. Зайдите на [search.google.com/search-console](https://search.google.com/search-console)
2. Добавьте свой сайт
3. Подтвердите владение через один из методов:
   - HTML файл (загрузите через Vercel)
   - Meta тег (добавьте в `app/layout.tsx`)
   - DNS запись

### 2. Sitemap

После деплоя ваш sitemap будет доступен по адресу:
- `https://your-domain.com/sitemap.xml`

Добавьте его в Google Search Console:
1. Перейдите в Sitemaps
2. Добавьте URL: `https://your-domain.com/sitemap.xml`

### 3. Robots.txt

Robots.txt автоматически генерируется и доступен по адресу:
- `https://your-domain.com/robots.txt`

## Настройка ролей пользователей

После создания пользователей в Supabase Auth, добавьте роли в таблицу `user_roles`:

### Руководство ОСС (board)
```sql
INSERT INTO user_roles (user_id, role, direction_id)
VALUES ('<user-uuid-from-auth>', 'board', NULL);
```

### Руководитель направления (lead)
```sql
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 
  '<user-uuid-from-auth>',
  'lead',
  id
FROM directions
WHERE slug = 'legal'; -- или другой slug направления
```

### Член ОСС (member)
```sql
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 
  '<user-uuid-from-auth>',
  'member',
  id
FROM directions
WHERE slug = 'scholarship'; -- или другой slug направления
```

### Аппарат (staff)
```sql
INSERT INTO user_roles (user_id, role, direction_id)
VALUES ('<user-uuid-from-auth>', 'staff', NULL);
```

Подробнее о ролях см. `database/roles_documentation.sql`

## Простое редактирование контента

### Для неопытных пользователей

1. Войдите в админ-панель: `/admin/login`
2. Перейдите в "Контент": `/admin/content`
3. Нажмите "Создать материал" или выберите существующий для редактирования
4. Заполните форму:
   - **Тип:** Новость / Гайд / FAQ
   - **Заголовок:** Название материала
   - **Slug:** URL адрес (автоматически генерируется из заголовка)
   - **Содержание:** Текст в формате Markdown
   - **Статус:** Черновик / Опубликовано / Архив

5. Нажмите "Сохранить"

### Форматирование Markdown

Простой синтаксис для форматирования:

- **Заголовки:**
  ```
  # Заголовок 1
  ## Заголовок 2
  ### Заголовок 3
  ```

- **Жирный текст:** `**текст**`
- **Курсив:** `*текст*`
- **Списки:**
  ```
  - Пункт 1
  - Пункт 2
  ```

- **Ссылки:** `[текст](https://ссылка)`

## Обновление сайта

После каждого изменения в коде:

1. Закоммитьте изменения:
```bash
git add .
git commit -m "Описание изменений"
git push
```

2. Vercel автоматически задеплоит изменения

## Мониторинг и логи

- **Vercel Dashboard:** Логи деплоя и ошибки
- **Supabase Dashboard:** Логи базы данных и запросов
- **Google Search Console:** Индексация и ошибки

## Резервное копирование

### База данных

1. В Supabase Dashboard → Database → Backups
2. Настройте автоматические бэкапы
3. Или используйте ручной экспорт через SQL Editor

### Код

Код хранится в GitHub репозитории, что является автоматическим бэкапом.

## Troubleshooting

### Сайт не обновляется
- Проверьте логи в Vercel Dashboard
- Убедитесь, что переменные окружения установлены
- Проверьте, что деплой завершился успешно

### Ошибки доступа к БД
- Проверьте переменные окружения в Vercel
- Проверьте RLS политики в Supabase
- Убедитесь, что пользователи имеют нужные роли

### Google не индексирует сайт
- Проверьте robots.txt
- Убедитесь, что sitemap.xml доступен
- Проверьте мета-теги в Google Search Console
- Убедитесь, что сайт доступен без авторизации

