# Несколько дизайнов: отдельные Next.js-приложения и Vercel

Каждый вариант — отдельная папка с собственным `package.json` и сборкой. В Vercel для каждого создаётся **отдельный проект** с указанием **Root Directory** на эту папку.

## Каталог концептов и папки

| № | Концепт | Папка (Root Directory) | Кратко |
|---|---------|-------------------------|--------|
| 1 | BrandDefault | `frontend/nextjs` | Базовый: тёмный градиент, красный OSS, переключение темы и сезонная зимняя логика. |
| 2 | BrandLightEditorial | `frontend/nextjs-design-light` | Светлый брендбук: `light` + `light-brandbook` на `<html>`, тема зафиксирована в `lib/theme.ts`. |
| 3 | WinterFrost | `frontend/nextjs-design-winter` | Зимняя палитра: `winter-theme`, `winter-theme-brandbook`, `dark` на `<html>`, зимние классы в `ThemeProvider`. |
| 4 | MidnightCrimson | `frontend/nextjs-design-midnight-crimson` | Почти чёрный фон, панели без стекла, тонкие красно-бирюзовые акценты на карточках и шапке. |
| 5 | PaperCampus | `frontend/nextjs-design-paper-campus` | Тёплый off-white «бумага», лёгкая линейная текстура, светлый хедер/футер; тема только светлая. |
| 6 | MonoStructure | `frontend/nextjs-design-mono-structure` | Плоский светлый минимализм, серые границы, без сильных градиентов; основная кнопка нейтрально-тёмная. |
| 7 | DirectionChapters | `frontend/nextjs-design-direction-chapters` | Тёмный фон; на главной секции «главы» с красной полосой у заголовков и цветными полосами у карточек направлений (`app/page.tsx`). |
| 8 | LisaLab | — | Под макеты из `Gaides/Lisa` — не заведён; добавьте копию `frontend/nextjs` → `frontend/nextjs-design-lisa` по референсам. |

Корневой класс концепта на `<html>`: `concept-midnight-crimson`, `concept-paper-campus`, `concept-mono-structure`, `concept-direction-chapters` (стили в конце `app/globals.css` соответствующей папки).

## Деплой на Vercel (один репозиторий — несколько проектов)

Для **каждого** варианта из таблицы:

1. **Add New Project** → этот Git-репозиторий.
2. **Root Directory** = путь из таблицы.
3. **Project Name** — только **латиница в нижнем регистре**, цифры и символы `.` `_` `-` (до 100 символов; нельзя подряд `---`). **Кириллица и заглавные буквы** (например `SaittOSESEьmidn`) Vercel отклонит. Примеры: `saitt-osese-paper-campus`, `saitt-osese-midnight-crimson`.
4. **Environment Variables** — скопировать с прод-проекта (Supabase, NextAuth, `NEXT_PUBLIC_*` и т.д.), если все варианты используют один бэкенд.
5. При необходимости отдельный домен/поддомен на проект.

Автоматический деплой без вашего аккаунта Vercel из среды разработки недоступен: Dashboard или `vercel` CLI после `vercel login`.

## Локальная проверка

```bash
cd frontend/nextjs-design-midnight-crimson
npm install
npm run build
```

Повторите для нужной папки.

## Синхронизация кода

Варианты — **полные копии**. После правок в эталоне `frontend/nextjs` переносите изменения вручную или через merge в `nextjs-design-*`. Долгосрочно возможен общий пакет в `packages/` (отдельная задача).
