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
