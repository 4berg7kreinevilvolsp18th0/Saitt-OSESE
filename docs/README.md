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

### Deployment

See **[Deployment Guide](docs/deployment.md)** for step-by-step instructions.

Quick version:
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy happens automatically

### Content Editing

See **[Content Editing Guide](docs/content-editing.md)** for how to add/edit content.

Quick start:
1. Go to `/admin/login`
2. Click "Контент"
3. Create or edit content
4. Save and publish

## 📁 Структура проекта

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

## 🛠 Разработка

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

### Backend (опционально)

```bash
cd backend/python
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📚 Documentation

Main guides (in English, simple language):

- **[Getting Started](docs/getting-started.md)** - Set up and run locally
- **[Deployment](docs/deployment.md)** - Deploy to Vercel
- **[Database Setup](docs/database.md)** - Configure Supabase
- **[Content Editing](docs/content-editing.md)** - How to add/edit content
- **[Troubleshooting](docs/troubleshooting.md)** - Fix common problems
- **[Features](docs/features.md)** - Theme, Telegram, and other features

Technical docs (for developers):

- `TECH_SPEC.md` - Technical specification
- `BRAND.md` - Design system and branding
- `OPERATIONS.md` - Operations procedures

## 🎨 Дизайн-система

- **Главная:** OSS-red (#D11F2A)
- **Правовой:** тёмно-синий (#1F2A44)
- **Инфраструктура:** сине-голубой (#2A7FFF)
- **Стипендии:** холодно-зелёный (#2E8B57)
- **Иностранные студенты:** ярко-жёлтый (#F5B301)
- **Нейтральное:** серый (#6B7280)

Подробнее в `docs/BRAND.md`

### Для дизайнеров

Если вы веб-дизайнер, работающий в Figma или Tilda:

- **[Интеграция дизайнера в проект](docs/ru/designer-integration.md)** - Полное руководство по работе с проектом
- **[Экспорт дизайна из Figma](docs/ru/figma-export-guide.md)** - Как экспортировать дизайн в код
- **[Профессиональная система дизайна](docs/ru/professional-design-system.md)** - Текущая система дизайна
- **[Градиенты из брендбука](docs/ru/gradients-brandbook.md)** - Цветовые градиенты для направлений

### Для администраторов ОСС

- **[Бесплатные сервисы](docs/ru/free-services-guide.md)** - Руководство по использованию бесплатных альтернатив для всех сервисов
- **[Настройка уведомлений](docs/ru/notifications.md)** - Как настроить Email, Push и Telegram уведомления
- **[Функции защиты прав студентов](docs/ru/student-rights-protection-features.md)** - Предложения по улучшению защиты прав

## 🔐 Роли и доступ

- `student` — внешний пользователь (без аккаунта)
- `member` — член ОСС
- `lead` — руководитель направления
- `board` — руководство ОСС
- `staff` — аппарат (техподдержка)

Доступ контролируется через Supabase RLS (Row Level Security).

## 🚢 Деплой

Проект настроен для деплоя на Vercel:

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Настройте Preview/Production окружения

Подробнее в `docs/OPERATIONS.md`

## 📝 Лицензия

Проект создан для ОСС ДВФУ.

## 🤝 Support

Having issues? Check these guides:

1. **[Troubleshooting](docs/troubleshooting.md)** - Common problems and fixes
2. **[Getting Started](docs/getting-started.md)** - Initial setup
3. **[Deployment](docs/deployment.md)** - Deployment issues
4. **[Database Setup](docs/database.md)** - Supabase configuration

Still stuck? Check:
- Vercel build logs
- Supabase logs  
- Browser console (F12)
- Environment variables

