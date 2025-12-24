# Настройка локальной PostgreSQL для разработки

## Зачем нужна локальная БД?

- ✅ Быстрая разработка (без задержек сети)
- ✅ Тестирование без ограничений
- ✅ Работа офлайн
- ✅ Безопасность (данные не покидают ваш ПК)

## ⚠️ Важно

**Локальная БД НЕ подходит для production!**
- ❌ Недоступна при выключенном ПК
- ❌ Недоступна из интернета
- ❌ Нет автоматических бэкапов

**Используйте для:**
- ✅ Локальной разработки
- ✅ Тестирования
- ✅ Обучения

---

## Установка PostgreSQL

### Windows

1. **Скачайте установщик:**
   - Перейдите на https://www.postgresql.org/download/windows/
   - Скачайте установщик (рекомендуется версия 15 или новее)

2. **Установка:**
   - Запустите установщик
   - Выберите компоненты (оставьте все по умолчанию)
   - Выберите папку установки
   - **ВАЖНО:** Запомните пароль для пользователя `postgres`!
   - Порт: `5432` (по умолчанию)
   - Локаль: `Russian, Russia` (или ваша)

3. **Проверка установки:**
   ```bash
   # Откройте командную строку
   psql --version
   ```

---

## Настройка DataGrip

### 1. Подключение к PostgreSQL

1. Откройте DataGrip
2. **File** → **New** → **Data Source** → **PostgreSQL**
3. Заполните:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Database:** `postgres` (для начала)
   - **User:** `postgres`
   - **Password:** (ваш пароль)
4. Нажмите **Test Connection**
5. Если всё ОК → **OK**

### 2. Создание базы данных

1. В DataGrip откройте консоль SQL (правой кнопкой на подключении → **New** → **Query Console**)
2. Выполните:

```sql
-- Создание базы данных для проекта
CREATE DATABASE oss_dvfu
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Russian_Russia.1251'
    LC_CTYPE = 'Russian_Russia.1251'
    TEMPLATE = template0;
```

3. Обновите подключение в DataGrip:
   - Правой кнопкой на подключении → **Modify Connection**
   - Измените **Database:** на `oss_dvfu`
   - **Test Connection** → **OK**

---

## Применение схемы базы данных

### 1. Выполнение schema.sql

1. В DataGrip откройте файл `database/schema.sql` из проекта
2. Выберите подключение к `oss_dvfu`
3. Выполните весь скрипт (Ctrl+Enter или кнопка Execute)

**Проверка:**
```sql
-- Проверьте, что таблицы созданы
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Должны быть таблицы:
- `directions`
- `appeals`
- `appeal_attachments`
- `appeal_comments`
- `content`
- `documents`
- `student_organizations`
- `user_roles`
- и другие...

### 2. (Опционально) Загрузка тестовых данных

1. Откройте `database/seed.sql`
2. Выполните скрипт

**Проверка:**
```sql
-- Проверьте данные
SELECT COUNT(*) FROM directions;
SELECT COUNT(*) FROM appeals;
```

---

## Настройка проекта для работы с локальной БД

### Вариант 1: Supabase локально (рекомендуется)

Supabase можно запустить локально через Docker:

1. **Установите Docker Desktop:**
   - https://www.docker.com/products/docker-desktop

2. **Клонируйте Supabase локально:**
   ```bash
   git clone --depth 1 https://github.com/supabase/supabase
   cd supabase/docker
   ```

3. **Запустите Supabase:**
   ```bash
   # Windows PowerShell
   docker-compose up -d
   ```

4. **Получите ключи:**
   - Откройте http://localhost:54323
   - Войдите (пароль по умолчанию в `.env` файле)
   - Скопируйте `anon key` и `service_role key`

5. **Настройте `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
   ```

### Вариант 2: Прямое подключение к PostgreSQL

Если хотите использовать PostgreSQL напрямую (без Supabase):

1. **Установите библиотеку:**
   ```bash
   cd frontend/nextjs
   npm install pg @types/pg
   ```

2. **Создайте файл `lib/postgresClient.ts`:**
   ```typescript
   import { Pool } from 'pg';

   const pool = new Pool({
     host: process.env.DB_HOST || 'localhost',
     port: parseInt(process.env.DB_PORT || '5432'),
     database: process.env.DB_NAME || 'oss_dvfu',
     user: process.env.DB_USER || 'postgres',
     password: process.env.DB_PASSWORD || '',
   });

   export default pool;
   ```

3. **Настройте `.env.local`:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=oss_dvfu
   DB_USER=postgres
   DB_PASSWORD=your-password
   ```

4. **Используйте в API routes:**
   ```typescript
   import pool from '@/lib/postgresClient';

   export async function GET() {
     const result = await pool.query('SELECT * FROM directions');
     return Response.json(result.rows);
   }
   ```

**⚠️ Проблема:** Нужно будет переписать весь код, который использует Supabase.

---

## Переключение между локальной и облачной БД

### Создайте два файла окружения:

**`.env.local` (локальная разработка):**
```env
# Локальная Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**`.env.production` (облачная):**
```env
# Облачная Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-cloud-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### В Vercel:

1. Перейдите в **Settings** → **Environment Variables**
2. Добавьте переменные для **Production**:
   - `NEXT_PUBLIC_SUPABASE_URL` = ваш облачный URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ваш облачный ключ

---

## Работа с файлами локально

### Supabase Storage локально

При использовании Supabase локально, Storage тоже работает локально:

1. **Создайте bucket в локальном Supabase:**
   - Откройте http://localhost:54323
   - Перейдите в **Storage**
   - Создайте bucket `appeal-attachments`

2. **Файлы будут храниться:**
   - В Docker контейнере Supabase
   - По пути: `supabase/docker/volumes/storage/`

### Альтернатива: Локальная файловая система

Если не используете Supabase локально:

1. **Создайте папку для файлов:**
   ```bash
   mkdir -p frontend/nextjs/public/uploads
   ```

2. **Измените API route `/api/upload/route.ts`:**
   ```typescript
   import { writeFile } from 'fs/promises';
   import { join } from 'path';

   // Сохраняем файл локально
   const bytes = await file.arrayBuffer();
   const buffer = Buffer.from(bytes);
   const path = join(process.cwd(), 'public', 'uploads', fileName);
   await writeFile(path, buffer);

   // Возвращаем URL
   const url = `/uploads/${fileName}`;
   ```

**⚠️ Проблема:** Файлы не будут доступны в production на Vercel (нужен внешний storage).

---

## Бэкапы локальной БД

### Создание бэкапа

```bash
# Windows PowerShell
pg_dump -U postgres -d oss_dvfu -F c -f backup.dump
```

### Восстановление из бэкапа

```bash
pg_restore -U postgres -d oss_dvfu -c backup.dump
```

### Автоматические бэкапы (Windows Task Scheduler)

1. Создайте файл `backup.bat`:
   ```batch
   @echo off
   set BACKUP_DIR=C:\backups\postgres
   set DATE=%date:~-4,4%%date:~-7,2%%date:~-10,2%
   pg_dump -U postgres -d oss_dvfu -F c -f %BACKUP_DIR%\oss_dvfu_%DATE%.dump
   ```

2. Настройте Task Scheduler:
   - Откройте **Планировщик заданий**
   - **Создать задачу**
   - Триггер: Ежедневно в 3:00
   - Действие: Запустить `backup.bat`

---

## Решение проблем

### Проблема: "Connection refused"

**Решение:**
1. Проверьте, запущен ли PostgreSQL:
   ```bash
   # Windows
   services.msc
   # Найдите "postgresql-x64-15" и проверьте статус
   ```

2. Проверьте порт:
   ```bash
   netstat -an | findstr 5432
   ```

### Проблема: "Password authentication failed"

**Решение:**
1. Сбросьте пароль:
   - Откройте `pgAdmin`
   - Правой кнопкой на сервере → **Properties** → **Connection**
   - Измените пароль

### Проблема: "Database does not exist"

**Решение:**
```sql
-- Создайте базу данных
CREATE DATABASE oss_dvfu;
```

### Проблема: "Permission denied"

**Решение:**
```sql
-- Дайте права пользователю
GRANT ALL PRIVILEGES ON DATABASE oss_dvfu TO postgres;
```

---

## Полезные команды SQL

```sql
-- Просмотр всех таблиц
\dt

-- Просмотр структуры таблицы
\d appeals

-- Подсчет записей
SELECT COUNT(*) FROM appeals;

-- Очистка таблицы (осторожно!)
TRUNCATE TABLE appeals CASCADE;

-- Экспорт данных в CSV
COPY appeals TO 'C:\backups\appeals.csv' CSV HEADER;

-- Импорт данных из CSV
COPY appeals FROM 'C:\backups\appeals.csv' CSV HEADER;
```

---

## Следующие шаги

1. ✅ Установите PostgreSQL
2. ✅ Настройте DataGrip
3. ✅ Создайте базу данных `oss_dvfu`
4. ✅ Выполните `database/schema.sql`
5. ✅ (Опционально) Выполните `database/seed.sql`
6. ✅ Настройте локальный Supabase или прямое подключение
7. ✅ Настройте `.env.local`
8. ✅ Протестируйте подключение

**Для production используйте облачный Supabase!**

