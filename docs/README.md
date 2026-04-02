# Сайт ОСС ДВФУ

Официальный сайт Объединённого совета студентов ДВФУ. Единое окно для обращений, гайдов, новостей и документов.

## 🚀 Быстрый старт
### Требования
- Node.js 18+ (LTS)
- npm/pnpm/yarn
- Python 3.11+ (для backend, опционально)
- Supabase аккаунт и проект
- GitHub аккаунт (для деплоя)
- Vercel аккаунт (для деплоя)

### Локальная разработка
1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd "Saitt OSESE"
```
2. Установите зависимости frontend:
```bash
cd frontend/nextjs
npm install
# или
pnpm install
```
3. Создайте файл `.env.local` в `frontend/nextjs/`:
```bash
cp .env.example .env.local
```
4. Заполните переменные окружения:
- `NEXT_PUBLIC_SUPABASE_URL` — URL вашего Supabase проекта
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — анонимный ключ Supabase
- `NEXT_PUBLIC_SITE_URL` — URL сайта (для локальной разработки: `http://localhost:3000`)
5. Настройте базу данных:
- Создайте проект в Supabase
- Примените `database/schema.sql` в SQL Editor
- Примените `database/analytics.sql` для публичной статистики
- (Опционально) Загрузите тестовые данные из `database/seed.sql`
6. Запустите dev-сервер:
```bash
npm run dev
# или
pnpm dev
```
Сайт будет доступен по адресу [http://localhost:3000](http://localhost:3000)
## Структура проекта

```
├── frontend/nextjs/     # Next.js приложение
│   ├── app/            # Страницы (App Router)
│   ├── components/     # React компоненты
│   ├── lib/            # Утилиты и конфигурация
│   └── content/        # Контент для CMS
├── backend/python/      # FastAPI backend (опционально)
├── database/           # SQL схемы и миграции
├── docs/               # Документация проекта
└── cms/                # Конфигурация CMS
```
## Разработка
### Frontend

- **Фреймворк:** Next.js 14 (App Router)
- **Стили:** Tailwind CSS
- **CMS:** Keystatic
- **База данных:** Supabase (PostgreSQL)

### Основные команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск production
npm run start

# Линтинг
npm run lint
```
### Backend

```bash
cd backend/python
pip install -r requirements.txt
uvicorn main:app --reload
```
## 🔐 Роли и доступ

- `student` — внешний пользователь (без аккаунта)
- `member` — член ОСС
- `lead` — руководитель направления
- `board` — руководство ОСС
- `staff` — аппарат (техподдержка)

Доступ контролируется через Supabase RLS (Row Level Security).

## 📝 Лицензия

Проект создан для ОСС ДВФУ 2026


