# Self-hosted база данных для ОСС ДВФУ

Руководство по переходу на собственную базу данных PostgreSQL для уменьшения зависимости от сторонних сервисов.

## 🎯 Зачем это нужно?

### Преимущества self-hosted БД:

1. **Безлимитная база данных** — нет ограничений по размеру
2. **Полный контроль** — настройка под свои нужды
3. **Безопасность** — данные на своем сервере
4. **Экономия** — бесплатно (если есть сервер)
5. **Независимость** — не зависим от лимитов Supabase

### Недостатки:

1. **Нужен сервер** — физический или виртуальный
2. **Поддержка** — нужно самому настраивать и поддерживать
3. **Бэкапы** — нужно настраивать самостоятельно
4. **Масштабирование** — нужно самому планировать

---

## 🖥️ Варианты размещения

### Вариант 1: Сервер ДВФУ (рекомендуется)

**Если ДВФУ может предоставить сервер:**

**Плюсы:**
- Бесплатно для ОСС
- Надежная инфраструктура
- Поддержка IT-отдела
- Возможно, уже есть PostgreSQL

**Что нужно:**
- Официальный запрос в IT-отдел ДВФУ
- Выделенный сервер или виртуальная машина
- Доступ для настройки

**Шаги:**
1. Написать запрос в IT-отдел ДВФУ
2. Указать требования (PostgreSQL, минимум 2 GB RAM, 50 GB диска)
3. Получить доступ к серверу
4. Установить PostgreSQL
5. Настроить подключение

### Вариант 2: VPS (виртуальный сервер)

**Бесплатные варианты:**

#### Oracle Cloud Free Tier
- 2 виртуальных машины (ARM)
- 4 GB RAM, 200 GB диска
- Бесплатно навсегда
- Подходит для PostgreSQL

#### Google Cloud Free Tier
- $300 кредитов на 3 месяца
- Потом можно использовать Always Free (ограниченно)

#### AWS Free Tier
- 750 часов EC2 в месяц (12 месяцев)
- Потом платно

**Платные (дешевые):**
- **DigitalOcean:** $6/месяц (1 GB RAM, 25 GB SSD)
- **Hetzner:** €4.15/месяц (2 GB RAM, 20 GB SSD)
- **Vultr:** $6/месяц (1 GB RAM, 25 GB SSD)

### Вариант 3: Railway / Render (managed PostgreSQL)

**Railway:**
- $5 кредитов в месяц бесплатно
- Managed PostgreSQL
- Автоматические бэкапы
- Простая настройка

**Render:**
- Free tier (ограниченно)
- Managed PostgreSQL
- Автоматические бэкапы

---

## 📋 Требования к серверу

### Минимальные требования:

**Для 3,000-10,000 обращений/год:**
- **CPU:** 1-2 ядра
- **RAM:** 2 GB (минимум), 4 GB (рекомендуется)
- **Диск:** 20 GB (минимум), 50 GB (рекомендуется)
- **ОС:** Ubuntu 22.04 LTS или Debian 12

**Для 10,000-20,000 обращений/год:**
- **CPU:** 2-4 ядра
- **RAM:** 4-8 GB
- **Диск:** 100 GB
- **ОС:** Ubuntu 22.04 LTS или Debian 12

### Программное обеспечение:

- PostgreSQL 14+ (рекомендуется 15+)
- Node.js 18+ (для миграций, опционально)
- Nginx (для reverse proxy, опционально)
- SSL сертификат (Let's Encrypt, бесплатно)

---

## 🚀 Пошаговая установка

### Шаг 1: Установка PostgreSQL

**На Ubuntu/Debian:**

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Проверить версию
psql --version

# Запустить службу
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Шаг 2: Настройка PostgreSQL

```bash
# Переключиться на пользователя postgres
sudo -u postgres psql

# Создать базу данных
CREATE DATABASE oss_dvfu;

# Создать пользователя
CREATE USER oss_user WITH PASSWORD 'strong_password_here';

# Дать права
GRANT ALL PRIVILEGES ON DATABASE oss_dvfu TO oss_user;

# Выйти
\q
```

### Шаг 3: Настройка безопасности

**Редактировать `postgresql.conf`:**
```bash
sudo nano /etc/postgresql/15/main/postgresql.conf
```

**Найти и изменить:**
```
listen_addresses = '*'  # или конкретный IP
port = 5432
max_connections = 100
shared_buffers = 256MB  # для 2 GB RAM
effective_cache_size = 1GB
```

**Редактировать `pg_hba.conf`:**
```bash
sudo nano /etc/postgresql/15/main/pg_hba.conf
```

**Добавить (для удаленного доступа):**
```
# Для подключения из Vercel/внешних сервисов
host    oss_dvfu    oss_user    0.0.0.0/0    md5
```

**Перезапустить PostgreSQL:**
```bash
sudo systemctl restart postgresql
```

### Шаг 4: Настройка файрвола

```bash
# Разрешить PostgreSQL порт
sudo ufw allow 5432/tcp

# Или только для конкретного IP (безопаснее)
sudo ufw allow from YOUR_IP to any port 5432
```

### Шаг 5: Применить схему базы данных

```bash
# Подключиться к БД
psql -U oss_user -d oss_dvfu -h localhost

# Или из файла
psql -U oss_user -d oss_dvfu -h localhost -f database/schema.sql
```

---

## 🔄 Миграция с Supabase

### Шаг 1: Экспорт данных из Supabase

**Через Supabase Dashboard:**
1. Зайти в SQL Editor
2. Выполнить дамп:

```sql
-- Экспорт обращений
COPY appeals TO '/tmp/appeals.csv' WITH CSV HEADER;

-- Экспорт направлений
COPY directions TO '/tmp/directions.csv' WITH CSV HEADER;

-- И так далее для всех таблиц
```

**Или через pg_dump:**
```bash
# Если есть доступ к Supabase через psql
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

### Шаг 2: Импорт в новую БД

```bash
# Применить схему
psql -U oss_user -d oss_dvfu -f database/schema.sql

# Импортировать данные
psql -U oss_user -d oss_dvfu -f backup.sql
```

### Шаг 3: Обновить переменные окружения

**В Vercel:**
```
DATABASE_URL=postgresql://oss_user:password@your-server-ip:5432/oss_dvfu
NEXT_PUBLIC_SUPABASE_URL=  # Можно оставить пустым или удалить
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Можно оставить пустым или удалить
```

**Для аутентификации:**
- Можно использовать Supabase Auth отдельно (бесплатно)
- Или перейти на NextAuth.js / Auth.js
- Или использовать простую JWT аутентификацию

---

## 🔐 Аутентификация без Supabase Auth

### Вариант 1: NextAuth.js (рекомендуется)

**Установка:**
```bash
npm install next-auth @auth/prisma-adapter
```

**Настройка:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Проверить в вашей БД
        const user = await checkUserInDB(credentials.email, credentials.password)
        if (user) return user
        return null
      }
    })
  ],
  // ...
}
```

### Вариант 2: Простая JWT аутентификация

**Создать таблицу пользователей:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**API для входа:**
```typescript
// app/api/auth/login/route.ts
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  // Проверить в БД
  const user = await db.query('SELECT * FROM users WHERE email = $1', [email])
  
  if (user && await compare(password, user.password_hash)) {
    const token = sign({ userId: user.id, role: user.role }, SECRET)
    return Response.json({ token })
  }
  
  return Response.json({ error: 'Invalid credentials' }, { status: 401 })
}
```

---

## 📦 Обновление кода проекта

### 1. Заменить Supabase Client на прямой PostgreSQL

**Было (Supabase):**
```typescript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, key)
const { data } = await supabase.from('appeals').select('*')
```

**Стало (прямой PostgreSQL):**
```typescript
import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const { rows } = await pool.query('SELECT * FROM appeals')
```

### 2. Создать утилиту для работы с БД

**`lib/db.ts`:**
```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('Executed query', { text, duration, rows: res.rowCount })
  return res
}

export default pool
```

### 3. Обновить все запросы

**Пример:**
```typescript
// Было
const { data, error } = await supabase
  .from('appeals')
  .select('*')
  .eq('status', 'new')

// Стало
const { rows } = await query(
  'SELECT * FROM appeals WHERE status = $1',
  ['new']
)
```

---

## 🛡️ Безопасность

### 1. SSL подключение

**В production обязательно использовать SSL:**
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('path/to/ca-cert.pem').toString()
  }
})
```

### 2. Ограничение доступа

**Настроить файрвол:**
- Разрешить доступ только с IP Vercel
- Или использовать VPN
- Или использовать SSH туннель

**Список IP Vercel:**
```
76.76.21.21
76.223.126.42
# И другие (см. Vercel docs)
```

### 3. Резервное копирование

**Автоматические бэкапы:**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U oss_user -d oss_dvfu > /backups/oss_dvfu_$DATE.sql

# Удалить старые бэкапы (старше 30 дней)
find /backups -name "*.sql" -mtime +30 -delete
```

**Настроить cron:**
```bash
# Ежедневный бэкап в 2:00
0 2 * * * /path/to/backup.sh
```

### 4. Мониторинг

**Настроить логирование:**
```bash
# В postgresql.conf
log_statement = 'all'  # или 'mod' для изменений
log_duration = on
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

---

## 📊 Мониторинг и обслуживание

### 1. Проверка использования

```sql
-- Размер базы данных
SELECT pg_size_pretty(pg_database_size('oss_dvfu'));

-- Размер таблиц
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 2. Оптимизация

**VACUUM и ANALYZE:**
```sql
-- Автоматически (настроить в postgresql.conf)
autovacuum = on
autovacuum_naptime = 1min

-- Или вручную
VACUUM ANALYZE;
```

### 3. Мониторинг производительности

**Установить pg_stat_statements:**
```sql
CREATE EXTENSION pg_stat_statements;

-- Топ медленных запросов
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## 💰 Стоимость

### Self-hosted (если есть сервер ДВФУ):
- **Бесплатно** ✅
- Нужна только поддержка

### VPS (если нет сервера ДВФУ):
- **Oracle Cloud Free Tier:** Бесплатно навсегда
- **DigitalOcean/Hetzner:** $4-6/месяц
- **Railway:** $5 кредитов/месяц (почти бесплатно)

### Сравнение с Supabase:
- **Supabase Free:** 500 MB БД, 1 GB Storage
- **Supabase Pro:** $25/месяц (8 GB БД, 100 GB Storage)
- **Self-hosted:** Безлимитно (в рамках сервера)

---

## 🎯 Рекомендации для ОСС

### Краткосрочная стратегия:

1. **Попробовать получить сервер у ДВФУ**
   - Написать официальный запрос
   - Указать требования
   - Объяснить пользу для студентов

2. **Если ДВФУ не может помочь:**
   - Использовать Oracle Cloud Free Tier
   - Или начать с Supabase, мигрировать позже

### Долгосрочная стратегия:

1. **Self-hosted БД на сервере ДВФУ**
   - Полный контроль
   - Безлимитно
   - Безопасность данных в университете

2. **Резервное копирование**
   - Ежедневные бэкапы
   - Хранить в нескольких местах

3. **Мониторинг**
   - Настроить алерты
   - Отслеживать производительность

---

## 📋 Чеклист миграции

### Подготовка:
- [ ] Получить сервер (ДВФУ или VPS)
- [ ] Установить PostgreSQL
- [ ] Настроить безопасность
- [ ] Применить схему БД

### Миграция данных:
- [ ] Экспортировать данные из Supabase
- [ ] Импортировать в новую БД
- [ ] Проверить целостность данных

### Обновление кода:
- [ ] Заменить Supabase Client на прямой PostgreSQL
- [ ] Обновить все запросы
- [ ] Настроить аутентификацию (NextAuth или JWT)
- [ ] Обновить переменные окружения

### Тестирование:
- [ ] Протестировать все функции
- [ ] Проверить производительность
- [ ] Настроить мониторинг

### Production:
- [ ] Настроить SSL
- [ ] Настроить бэкапы
- [ ] Настроить файрвол
- [ ] Обновить документацию

---

## 🔗 Полезные ссылки

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)
- [pg (Node.js PostgreSQL client)](https://node-postgres.com/)

---

**Итог:** Self-hosted БД — отличный вариант для ОСС, если есть доступ к серверу. Это дает полный контроль, безлимитную БД и независимость от сторонних сервисов.

