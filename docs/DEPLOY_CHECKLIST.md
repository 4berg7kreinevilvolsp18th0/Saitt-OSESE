# Чек-лист для деплоя на Vercel

## ✅ Шаг 1: Подготовка кода
- [x] Git репозиторий инициализирован
- [x] Код закоммичен
- [x] .gitignore настроен правильно

## 📝 Шаг 2: Создание репозитория на GitHub

1. Зайдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Название: `oss-dvfu-site` (или другое)
4. Выберите Public или Private
5. НЕ добавляйте README, .gitignore или лицензию (уже есть)
6. Нажмите "Create repository"

## 🔗 Шаг 3: Подключение к GitHub

Выполните в терминале (замените YOUR_USERNAME и REPO_NAME):

```bash
cd "C:\Users\Kreig\Saitt OSESE"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 🗄️ Шаг 4: Настройка Supabase

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Запомните:
   - Project URL (например: `https://xxxxx.supabase.co`)
   - Anon key (найти в Settings → API)

4. В SQL Editor выполните файлы в порядке:
   - `database/schema.sql`
   - `database/analytics.sql` (если есть)

5. Создайте пользователей в Authentication → Users

## 🚀 Шаг 5: Деплой на Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "Add New Project"
4. Импортируйте ваш репозиторий
5. **ВАЖНО:** Настройте проект:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend/nextjs` ⚠️
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

6. Добавьте Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = ваш-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = ваш-supabase-anon-key
   NEXT_PUBLIC_SITE_URL = https://ваш-проект.vercel.app
   ```

7. Нажмите "Deploy"

8. После деплоя:
   - Скопируйте URL сайта из Vercel
   - Обновите `NEXT_PUBLIC_SITE_URL` в Vercel
   - Перезапустите деплой

## 👥 Шаг 6: Настройка ролей

После создания пользователей в Supabase, добавьте роли через SQL Editor:

```sql
-- Руководство ОСС
INSERT INTO user_roles (user_id, role, direction_id)
VALUES ('<user-uuid>', 'board', NULL);

-- Руководитель направления
INSERT INTO user_roles (user_id, role, direction_id)
SELECT '<user-uuid>', 'lead', id
FROM directions WHERE slug = 'legal';
```

Подробнее: `database/roles_documentation.sql`

## 🔍 Шаг 7: Настройка Google Search Console

1. Зайдите на [search.google.com/search-console](https://search.google.com/search-console)
2. Добавьте свой сайт
3. Подтвердите владение
4. Отправьте sitemap: `https://ваш-сайт.vercel.app/sitemap.xml`

## ✅ Готово!

Ваш сайт должен быть доступен по адресу Vercel и индексироваться в Google.

