# Быстрое исправление ошибки 404

## Проблема
Ошибка `404: NOT_FOUND` возникает потому, что Supabase не настроен или переменные окружения не установлены.

## Решение (5 минут)

### Шаг 1: Создайте проект Supabase

1. Зайдите на https://supabase.com
2. Создайте аккаунт или войдите
3. Нажмите "New Project"
4. Заполните форму и создайте проект

### Шаг 2: Получите ключи API

1. В Supabase Dashboard → **Settings** → **API**
2. Скопируйте:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon public** ключ (длинная строка)

### Шаг 3: Настройте базу данных

1. В Supabase Dashboard → **SQL Editor**
2. Откройте файл `database/schema.sql` из проекта
3. Скопируйте весь SQL код и выполните его
4. (Опционально) Выполните `database/seed.sql` для тестовых данных

### Шаг 4: Добавьте переменные в Vercel

1. Зайдите в Vercel Dashboard → ваш проект
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте 3 переменные:

```
NEXT_PUBLIC_SUPABASE_URL = https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = ваш-anon-ключ
NEXT_PUBLIC_SITE_URL = https://ваш-домен.vercel.app
```

4. Выберите все окружения (Production, Preview, Development)
5. Нажмите "Save"

### Шаг 5: Перезапустите деплой

1. В Vercel Dashboard → **Deployments**
2. Нажмите "..." на последнем деплое → **Redeploy**

### Готово! ✅

После перезапуска сайт должен работать. Если ошибка сохраняется, проверьте:
- Правильность скопированных ключей (без пробелов)
- Что проект Supabase активен (не приостановлен)
- Логи в Vercel Dashboard → Deployments → последний деплой

## Подробная инструкция

См. файл `docs/SUPABASE_SETUP.md` для детальной инструкции.

