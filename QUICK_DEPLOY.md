# 🚀 Быстрый деплой на Vercel

## ✅ Шаг 1: Код готов
- Git репозиторий инициализирован ✅
- Первый коммит создан ✅
- Все файлы готовы ✅

## 📤 Шаг 2: Загрузите код на GitHub

### Вариант А: Через веб-интерфейс GitHub

1. Зайдите на [github.com](https://github.com) и войдите
2. Нажмите **"+"** → **"New repository"**
3. Название: `oss-dvfu-site` (или другое)
4. Выберите **Public** или **Private**
5. **НЕ** добавляйте README, .gitignore или лицензию
6. Нажмите **"Create repository"**

### Вариант Б: Через командную строку

Выполните команды (замените YOUR_USERNAME и REPO_NAME):

```powershell
cd "C:\Users\Kreig\Saitt OSESE"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

Если GitHub попросит авторизацию:
- Используйте Personal Access Token вместо пароля
- Или используйте GitHub Desktop

## 🗄️ Шаг 3: Настройте Supabase

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Запомните:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **Anon key** (найти в Settings → API)

4. В **SQL Editor** выполните файлы:
   - `database/schema.sql` - создаст таблицы
   - `database/analytics.sql` - создаст статистику

5. Создайте пользователей в **Authentication → Users**

## 🚀 Шаг 4: Деплой на Vercel (с автоматическим деплоем)

1. Зайдите на [vercel.com](https://vercel.com)
2. Войдите через **GitHub**
3. Нажмите **"Add New..." → "Project"** ✅
   - ⚠️ Выберите именно **"Project"**, не Domain/Store/Integration
4. Выберите ваш репозиторий из списка
5. Нажмите **"Import"**

6. **ВАЖНО:** Настройте проект:
   ```
   Project Name: oss-dvfu-site (или любое другое)
   Framework Preset: Next.js ✅
   Root Directory: frontend/nextjs  ⚠️ ОБЯЗАТЕЛЬНО!
   Build Command: npm run build (или по умолчанию)
   Output Directory: .next (или по умолчанию)
   Install Command: npm install (или по умолчанию)
   ```

7. Добавьте **Environment Variables** (нажмите "Environment Variables"):
   ```
   NEXT_PUBLIC_SUPABASE_URL = ваш-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = ваш-supabase-anon-key
   NEXT_PUBLIC_SITE_URL = https://ваш-проект.vercel.app
   ```
   (URL сайта можно обновить после первого деплоя)

8. Нажмите **"Deploy"**

9. После успешного деплоя:
   - Скопируйте URL сайта из Vercel (например: `https://oss-dvfu-site.vercel.app`)
   - Зайдите в Settings → Environment Variables
   - Обновите `NEXT_PUBLIC_SITE_URL` на ваш реальный URL
   - Нажмите **"Redeploy"**

10. ✅ **Автоматический деплой настроен!**
    - Теперь каждый push в `main` автоматически деплоится
    - Pull Requests получают preview деплои
    - Подробнее: `docs/AUTO_DEPLOY.md` и `docs/VERCEL_SETUP.md`

## 👥 Шаг 5: Настройте роли пользователей

После создания пользователей в Supabase, добавьте роли через SQL Editor:

```sql
-- Руководство ОСС (видит всё)
INSERT INTO user_roles (user_id, role, direction_id)
VALUES ('<user-uuid-из-auth>', 'board', NULL);

-- Руководитель направления
INSERT INTO user_roles (user_id, role, direction_id)
SELECT '<user-uuid>', 'lead', id
FROM directions WHERE slug = 'legal';
```

Подробнее: `database/roles_documentation.sql`

## 🔍 Шаг 6: Настройте Google Search Console

1. Зайдите на [search.google.com/search-console](https://search.google.com/search-console)
2. Добавьте свой сайт
3. Подтвердите владение (через HTML файл или meta тег)
4. Отправьте sitemap: `https://ваш-сайт.vercel.app/sitemap.xml`

## ✅ Готово!

Ваш сайт должен быть доступен и готов к использованию!

### Полезные ссылки:
- **Полная инструкция:** `docs/DEPLOY.md`
- **Руководство по редактированию:** `docs/EDITING_GUIDE.md`
- **Документация ролей:** `database/roles_documentation.sql`

