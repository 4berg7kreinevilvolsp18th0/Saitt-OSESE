# О проекте

## 📋 Описание

Официальный сайт Объединённого совета студентов Дальневосточного федерального университета (ОСС ДВФУ). Единая платформа для подачи обращений, публикации новостей, гайдов и документов, а также управления студенческими организациями.

---

## 🏗️ Архитектура проекта

Проект построен на современном стеке технологий с разделением на frontend и backend компоненты.

### Frontend

**Основной стек:**
- **Next.js 14** (App Router) — React-фреймворк для серверного рендеринга и статической генерации
- **React 18.3** — библиотека для построения пользовательского интерфейса
- **TypeScript 5.6** — типизированный JavaScript для надежности кода
- **Tailwind CSS 3.4** — utility-first CSS фреймворк для стилизации

**Дополнительные библиотеки:**
- **@supabase/supabase-js** — клиент для работы с Supabase (база данных и аутентификация)
- **recharts** — библиотека для построения графиков и диаграмм
- **react-markdown** — рендеринг Markdown контента
- **otplib** — генерация одноразовых паролей для двухфакторной аутентификации
- **qrcode** — генерация QR-кодов
- **@upstash/redis** и **ioredis** — работа с Redis для кэширования и rate limiting

**CMS:**
- **Keystatic** — headless CMS для управления контентом через Git

### Backend (опционально)

**Основной стек:**
- **FastAPI 0.109** — современный Python веб-фреймворк для создания API
- **SQLAlchemy 2.0** — ORM для работы с базой данных
- **Uvicorn** — ASGI сервер для запуска FastAPI
- **Pydantic 2.5** — валидация данных и схемы

**Дополнительные библиотеки:**
- **psycopg2-binary** — драйвер PostgreSQL
- **httpx** — HTTP клиент для внешних API
- **openpyxl** — работа с Excel файлами для экспорта данных
- **slowapi** — rate limiting для API
- **python-jose** — работа с JWT токенами
- **redis** — кэширование и очереди

### База данных

- **Supabase** (PostgreSQL) — основная база данных
  - Row Level Security (RLS) для контроля доступа
  - Автоматические бэкапы
  - Реалтайм подписки
  - Встроенная аутентификация

**Схема базы данных:**
- `appeals` — обращения студентов
- `content` — новости, гайды, статьи
- `directions` — направления работы ОСС
- `documents` — документы и файлы
- `users` — пользователи системы
- `user_roles` — роли пользователей
- `appeal_history` — история изменений обращений
- `notifications` — уведомления

---

## 🛠️ Используемые сервисы

### Хостинг и деплой

- **Vercel** — хостинг frontend приложения
  - Автоматический деплой из GitHub
  - Preview окружения для каждого PR
  - Edge Functions для API routes
  - CDN для статических файлов

### База данных и хранение

- **Supabase** — Backend-as-a-Service
  - PostgreSQL база данных
  - Файловое хранилище (Storage)
  - Аутентификация и авторизация
  - Реалтайм подписки
  - Edge Functions (опционально)

### Кэширование и очереди

- **Upstash Redis** — управляемый Redis
  - Кэширование данных
  - Rate limiting
  - Очереди задач

### CI/CD и автоматизация

- **GitHub Actions** — автоматизация процессов
  - Автоматические тесты
  - CodeQL сканирование безопасности
  - Dependabot для обновления зависимостей
  - Автоматический деплой миграций базы данных
  - Code quality проверки

### Мониторинг и безопасность

- **GitHub Security** — сканирование кода на уязвимости
  - CodeQL анализ
  - Secret scanning
  - Dependency review
  - Security advisories

### Интеграции

- **Telegram Bot API** — интеграция с Telegram каналом
  - Отображение последних постов
  - Уведомления (опционально)

- **Email сервисы** (Resend, SendGrid и др.) — отправка email уведомлений
  - Уведомления о статусе обращений
  - Восстановление пароля
  - Двухфакторная аутентификация

---

## 🎨 Дизайн и UX

### Темы

- **Темная тема** (по умолчанию) — основной дизайн
- **Светлая тема** — альтернативный вариант
- **Зимняя/Новогодняя тема** — сезонная тема с анимацией снежинок

### Цветовая схема

- **OSS Red** (#D11F2A) — основной цвет бренда
- **OSS Dark** (#0F1115) — фон темной темы
- **Направления** — уникальные цвета для каждого направления:
  - Правовой комитет: #1F2A44
  - Инфраструктура: #2A7FFF
  - Стипендии: #2E8B57
  - Иностранные студенты: #F5B301

### Анимации

- CSS animations для плавных переходов
- Анимация появления элементов (fade-in)
- Анимация снежинок в зимней теме
- Плавные hover эффекты

---

## 🔐 Безопасность

### Аутентификация

- **Supabase Auth** — встроенная аутентификация
  - Email/пароль
  - Двухфакторная аутентификация (2FA)
  - OAuth провайдеры (опционально)

### Защита данных

- **Row Level Security (RLS)** — контроль доступа на уровне строк
- **Rate Limiting** — защита от DDoS и злоупотреблений
- **Input Validation** — валидация всех входных данных
- **SQL Injection Protection** — параметризованные запросы
- **XSS Protection** — санитизация пользовательского контента

### Мониторинг безопасности

- **CodeQL** — статический анализ кода
- **Secret Scanning** — поиск секретов в коде
- **Dependency Review** — проверка уязвимостей в зависимостях
- **Security Audit** — регулярные проверки безопасности

---

## 📦 Структура проекта

```
Saitt OSESE/
│
├── frontend/nextjs/                    # Next.js 14 приложение (основной frontend)
│   ├── app/                            # App Router (страницы и маршруты)
│   │   ├── page.tsx                    # Главная страница
│   │   ├── about/                      # Страница "О проекте"
│   │   ├── admin/                      # Админ-панель для членов ОСС
│   │   │   ├── page.tsx                # Главная админ-панели
│   │   │   ├── login/                  # Вход в админ-панель
│   │   │   ├── register/               # Регистрация
│   │   │   ├── appeals/                # Управление обращениями
│   │   │   ├── content/                # Управление контентом
│   │   │   ├── dashboards/             # Дашборды со статистикой
│   │   │   ├── profile/                # Профиль пользователя
│   │   │   └── settings/               # Настройки (включая 2FA)
│   │   ├── manage/                     # Управление для руководителей
│   │   │   ├── appeals/                 # Управление обращениями
│   │   │   ├── dashboards/              # Дашборды
│   │   │   └── profile/                # Профиль
│   │   ├── appeal/                      # Публичные страницы обращений
│   │   │   ├── page.tsx                 # Форма подачи обращения
│   │   │   └── status/                  # Проверка статуса обращения
│   │   ├── api/                         # API Routes (Next.js API)
│   │   │   ├── appeals/                 # API для обращений
│   │   │   ├── auth/                    # API аутентификации
│   │   │   ├── notifications/           # API уведомлений
│   │   │   ├── telegram/                # API Telegram интеграции
│   │   │   ├── export/                 # API экспорта данных
│   │   │   ├── upload/                 # API загрузки файлов
│   │   │   └── security/               # API безопасности
│   │   ├── directions/                  # Страницы направлений
│   │   │   ├── page.tsx                 # Список всех направлений
│   │   │   └── [slug]/                  # Страница конкретного направления
│   │   ├── content/                     # Публичные страницы контента
│   │   │   ├── page.tsx                 # Список контента
│   │   │   └── [slug]/                  # Страница конкретного контента
│   │   ├── documents/                   # Страница документов
│   │   ├── statistics/                   # Публичная статистика
│   │   ├── contacts/                    # Контакты
│   │   ├── login/                       # Публичная страница входа
│   │   ├── register/                    # Публичная страница регистрации
│   │   ├── layout.tsx                    # Корневой layout
│   │   ├── globals.css                   # Глобальные стили
│   │   ├── manifest.ts                   # PWA манифест
│   │   ├── robots.ts                     # SEO robots.txt
│   │   └── sitemap.ts                   # SEO sitemap
│   │
│   ├── components/                      # React компоненты
│   │   ├── Header.tsx                    # Шапка сайта
│   │   ├── Footer.tsx                    # Подвал сайта
│   │   ├── DirectionCard.tsx            # Карточка направления
│   │   ├── ContentCard.tsx               # Карточка контента
│   │   ├── AppealCard.tsx                # Карточка обращения
│   │   ├── AppealStatusBadge.tsx         # Бейдж статуса обращения
│   │   ├── AppealHistory.tsx             # История обращения
│   │   ├── FileUpload.tsx                # Компонент загрузки файлов
│   │   ├── SearchBar.tsx                 # Поиск
│   │   ├── Logo.tsx                      # Логотип
│   │   ├── ThemeProvider.tsx             # Провайдер темы
│   │   ├── ThemeToggle.tsx               # Переключатель темы
│   │   ├── WinterTheme.tsx               # Зимняя тема
│   │   ├── Snowflakes.tsx                # Анимация снежинок
│   │   ├── TelegramPosts.tsx             # Компонент Telegram постов
│   │   ├── StudentOrganizations.tsx      # Студенческие организации
│   │   ├── StudentOrganizationsCard.tsx  # Карточка организаций
│   │   ├── Toast.tsx                      # Уведомления
│   │   ├── ToastProvider.tsx              # Провайдер уведомлений
│   │   ├── LanguageToggle.tsx            # Переключатель языка
│   │   ├── LocaleProvider.tsx            # Провайдер локализации
│   │   └── MobileMenu.tsx                # Мобильное меню
│   │
│   ├── lib/                              # Утилиты и библиотеки
│   │   ├── supabaseClient.ts             # Клиент Supabase
│   │   ├── theme.ts                      # Утилиты темы и цветов
│   │   ├── directions.ts                 # Данные направлений
│   │   ├── circuitBreaker.ts            # Circuit Breaker паттерн
│   │   ├── serviceIsolation.ts          # Изоляция сервисов
│   │   ├── apiProtection.ts             # Защита API (rate limiting)
│   │   ├── errorBoundary.ts             # Error Boundaries
│   │   ├── apiExample.ts                # Примеры использования API
│   │   └── ...                          # Другие утилиты
│   │
│   ├── locales/                         # Локализация
│   │   ├── ru.json                      # Русский язык
│   │   └── en.json                      # Английский язык
│   │
│   ├── public/                          # Статические файлы
│   │   ├── Лого вектор белое.png        # Логотипы
│   │   ├── fonts/                       # Шрифты (SF UI)
│   │   └── ...                          # Другие статические файлы
│   │
│   ├── scripts/                         # Скрипты
│   │   └── create-admin.ts             # Создание администратора
│   │
│   ├── package.json                     # Зависимости npm
│   ├── tsconfig.json                    # Конфигурация TypeScript
│   ├── tailwind.config.js               # Конфигурация Tailwind CSS
│   ├── next.config.js                    # Конфигурация Next.js
│   ├── middleware.ts                     # Next.js middleware
│   ├── keystatic.config.ts               # Конфигурация CMS Keystatic
│   └── vercel.json                       # Конфигурация Vercel
│
├── backend/python/                      # FastAPI backend (опционально)
│   ├── main.py                          # Точка входа приложения
│   ├── models.py                        # SQLAlchemy модели данных
│   ├── schemas.py                       # Pydantic схемы валидации
│   ├── crud.py                          # CRUD операции
│   ├── database.py                      # Подключение к БД
│   ├── auth.py                          # Аутентификация
│   ├── middleware.py                    # Middleware (rate limiting)
│   ├── errors.py                         # Обработка ошибок
│   ├── search.py                        # Поиск
│   ├── analytics.py                     # Аналитика
│   ├── export.py                        # Экспорт данных
│   ├── requirements.txt                 # Python зависимости
│   └── README.md                        # Документация backend
│
├── database/                            # База данных
│   ├── schema.sql                       # Основная схема БД
│   ├── analytics.sql                    # Схема для аналитики
│   ├── rls_setup.sql                    # Настройка Row Level Security
│   ├── roles_documentation.sql           # Документация ролей
│   ├── notifications_schema.sql         # Схема уведомлений
│   ├── seed.sql                         # Тестовые данные
│   ├── migrations/                      # Миграции БД
│   │   ├── add_2fa_support.sql         # Поддержка 2FA
│   │   ├── add_telegram_notifications.sql # Telegram уведомления
│   │   ├── add_content_protection.sql   # Защита контента
│   │   ├── add_security_logging.sql     # Логирование безопасности
│   │   ├── add_file_retention.sql       # Хранение файлов
│   │   ├── improve_anonymity.sql        # Улучшение анонимности
│   │   ├── fix_security_issues.sql      # Исправления безопасности
│   │   ├── fix_uuid_type_errors.sql      # Исправления UUID
│   │   ├── ensure_all_tables_exist.sql  # Проверка таблиц
│   │   └── check_tables_before_migration.sql # Проверка перед миграцией
│   ├── load_test_appeals.sql           # Тестовые обращения
│   ├── assign_roles.sql                 # Назначение ролей
│   ├── CHECK_SEED_DATA.sql              # Проверка тестовых данных
│   ├── QUICK_CHECK.sql                  # Быстрая проверка
│   └── VERIFY_SETUP.sql                 # Проверка настройки
│
├── docs/                                # Документация проекта
│   ├── README.md                        # Главный README
│   ├── TECH_SPEC.md                     # Техническая спецификация
│   ├── BRAND.md                         # Брендбук и дизайн-система
│   ├── OPERATIONS.md                    # Операционные процедуры
│   ├── TODO.md                          # Список задач
│   ├── BACKLOG.md                       # Бэклог
│   ├── WORKPLAN.md                      # План работ
│   ├── DASHBOARDS.md                    # Документация дашбордов
│   ├── SUPABASE_SETUP.md                # Настройка Supabase
│   ├── VERCEL_SETUP.md                  # Настройка Vercel
│   ├── GITHUB_ACTIONS_SETUP.md          # Настройка GitHub Actions
│   ├── ru/                              # Русская документация
│   │   ├── README.md                    # Главный README (RU)
│   │   ├── PROJECT.md                   # О проекте (этот файл)
│   │   ├── getting-started.md           # Начало работы
│   │   ├── CODE_SCANNING.md             # Сканирование кода
│   │   ├── HOW_TO_GET_SCAN_ERRORS.md    # Получение ошибок сканирования
│   │   ├── SECURITY_ARCHITECTURE.md     # Архитектура безопасности
│   │   ├── FAULT_TOLERANCE.md           # Отказоустойчивость
│   │   ├── WINTER_THEME.md              # Зимняя тема
│   │   ├── designer-integration.md      # Интеграция дизайнера
│   │   ├── free-services-guide.md       # Бесплатные сервисы
│   │   └── ...                          # Другие документы
│   ├── en/                              # Английская документация
│   │   ├── README.md
│   │   ├── getting-started.md
│   │   ├── deployment.md
│   │   ├── database.md
│   │   ├── content-editing.md
│   │   ├── features.md
│   │   ├── troubleshooting.md
│   │   └── telegram-setup.md
│   └── archive/                         # Архив устаревших документов
│       └── ...                          # Старые версии документации
│
├── scripts/                             # Вспомогательные скрипты
│   ├── export-scan-errors.js            # Экспорт ошибок сканирования (Node.js)
│   ├── export-scan-errors.sh            # Экспорт ошибок сканирования (Bash)
│   └── README.md                        # Документация скриптов
│
├── cms/                                 # Конфигурация CMS
│   └── config.yml                       # Конфигурация Keystatic
│
├── content/                             # Контент для CMS
│   └── news/                            # Новости
│       └── example.md                  # Пример новости
│
├── .github/                             # GitHub конфигурация
│   ├── workflows/                       # GitHub Actions workflows
│   │   ├── ci.yml                       # Continuous Integration
│   │   ├── codeql.yml                   # CodeQL сканирование
│   │   ├── security-audit.yml           # Аудит безопасности
│   │   ├── code-quality.yml             # Проверка качества кода
│   │   ├── code-scanning.yml            # Сканирование кода
│   │   ├── secret-scanning.yml          # Сканирование секретов
│   │   ├── super-linter.yml             # Super Linter
│   │   ├── dependency-review.yml        # Обзор зависимостей
│   │   └── supabase-sync.yml            # Синхронизация с Supabase
│   ├── SECURITY.md                      # Политика безопасности
│   ├── CODE_OF_CONDUCT.md               # Кодекс поведения
│   ├── CONTRIBUTING.md                  # Руководство для контрибьюторов
│   ├── SUPPORT.md                       # Поддержка
│   ├── FUNDING.yml                      # Спонсорство
│   ├── dependabot.yml                   # Dependabot конфигурация
│   └── ISSUE_TEMPLATE/                  # Шаблоны issues
│       ├── bug_report.md
│       └── security.md
│
├── .gitignore                           # Игнорируемые файлы Git
├── SECURITY.md                          # Политика безопасности (корневой)
└── README.md                            # Главный README проекта
```

---

## 🚀 Возможности

### Для студентов

- ✅ Подача обращений по различным направлениям
- ✅ Отслеживание статуса обращений
- ✅ Просмотр новостей и гайдов
- ✅ Поиск документов
- ✅ Просмотр статистики работы ОСС
- ✅ Интеграция с Telegram каналом

### Для членов ОСС

- ✅ Админ-панель для управления обращениями
- ✅ Назначение ответственных
- ✅ Установка приоритетов и дедлайнов
- ✅ Комментирование обращений
- ✅ Управление контентом (новости, гайды)
- ✅ Дашборды со статистикой
- ✅ Экспорт данных в Excel

### Технические возможности

- ✅ Серверный рендеринг (SSR)
- ✅ Статическая генерация (SSG)
- ✅ Реалтайм обновления через Supabase
- ✅ PWA поддержка
- ✅ Мультиязычность (русский/английский)
- ✅ Адаптивный дизайн
- ✅ SEO оптимизация

---

## 📊 Масштабируемость

### Текущие лимиты (бесплатные планы)

- **Supabase:** 500 MB БД, 1 GB хранилища, 2 GB трафика/месяц
- **Vercel:** 100 GB bandwidth/месяц, безлимитные запросы
- **Upstash Redis:** 10,000 команд/день

### Оптимизация

- Кэширование запросов
- Ленивая загрузка компонентов
- Оптимизация изображений
- Database индексы
- Rate limiting для защиты

---

## 🔄 Процессы разработки

### Git Workflow

- **main/master** — production ветка
- **develop** — ветка разработки
- Feature branches — для новых фич

### CI/CD Pipeline

1. **Push в main** → автоматический деплой на Vercel
2. **Pull Request** → запуск тестов и проверок
3. **CodeQL** → сканирование безопасности
4. **Dependabot** → проверка зависимостей
5. **Super Linter** → проверка качества кода

### Миграции базы данных

- Автоматическое применение миграций через GitHub Actions
- Версионирование схемы БД
- Откат миграций (rollback)

---

## 📚 Документация

### Для разработчиков

- [Начало работы](getting-started.md)
- [Техническая спецификация](../TECH_SPEC.md)
- [Архитектура безопасности](SECURITY_ARCHITECTURE.md)
- [Fault Tolerance](FAULT_TOLERANCE.md)

### Для администраторов

- [Настройка Supabase](SUPABASE_SETUP.md)
- [Деплой на Vercel](../VERCEL_SETUP.md)
- [Управление контентом](content-editing.md)
- [Бесплатные сервисы](free-services-guide.md)

### Для дизайнеров

- [Интеграция дизайнера](designer-integration.md)
- [Система дизайна](professional-design-system.md)

---

## 🤝 Поддержка

- **Документация:** `docs/ru/`
- **GitHub Issues:** для багов и предложений
- **Security:** см. `.github/SECURITY.md`

---

## 📝 Лицензия

Проект создан для ОСС ДВФУ. Все права защищены.

---

**Версия:** 2.0  
**Последнее обновление:** 2024

