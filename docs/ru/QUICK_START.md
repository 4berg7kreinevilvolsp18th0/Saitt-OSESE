# Быстрый старт: Настройка Supabase и GitHub Actions

## 🚀 Быстрая настройка (5 минут)

### 1. Supabase (3 минуты)

1. **Создайте проект:** https://supabase.com → New Project
2. **Скопируйте ключи:** Settings → API → Project URL и anon key
3. **Выполните миграции:** SQL Editor → выполните файлы по порядку:
   - `database/schema.sql`
   - `database/migrations/add_file_retention.sql`
   - `database/migrations/improve_anonymity.sql`
   - `database/migrations/add_content_protection.sql`
   - `database/migrations/fix_security_issues.sql`
4. **Создайте Storage bucket:** Storage → New bucket → `appeal-attachments` (публичный)

### 2. Переменные окружения (1 минута)

Создайте `frontend/nextjs/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. GitHub Actions (1 минута)

1. **GitHub Secrets:** Settings → Secrets → Actions → добавить:
   - `SUPABASE_ACCESS_TOKEN` (из Supabase → Settings → Access Tokens)
   - `SUPABASE_PROJECT_ID` (из Supabase → Settings → General → Reference ID)
   - `SUPABASE_DB_PASSWORD` (пароль БД при создании проекта)
2. **Готово!** Workflow файл уже создан: `.github/workflows/supabase-sync.yml`

---

## 📚 Подробные инструкции

- **Полная настройка Supabase:** `docs/ru/SUPABASE_SETUP_COMPLETE.md`
- **Настройка GitHub Actions:** `docs/ru/GITHUB_ACTIONS_SETUP.md`

---

## ✅ Проверка

```bash
# Локально
cd frontend/nextjs
npm install
npm run dev
# Откройте http://localhost:3000

# GitHub Actions
# Сделайте коммит в database/ → проверьте Actions
```

---

## 🆘 Проблемы?

См. раздел "Решение проблем" в `SUPABASE_SETUP_COMPLETE.md`

