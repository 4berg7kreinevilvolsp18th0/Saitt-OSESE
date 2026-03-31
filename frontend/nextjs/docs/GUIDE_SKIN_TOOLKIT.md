# Инструментарий скинов гайдов (конкурс и кастомные темы)

Краткая инструкция для дизайнеров и разработчиков, которые делают отдельную визуальную оболочку под гайды (в т.ч. с анимациями), **не копируя** текст материалов.

## Принцип

1. **Контент** — секции, списки, таблицы, ссылки — остаётся в JSX страницы или общих компонентах (`GuideSection`, `GuideCallout`, …).
2. **Скин** — только layout, фон, типографика, навигация, анимации оболочки. Один скин = один React-компонент-обёртка вокруг `children`.
3. Новый участник конкурса: добавить `GuideSkin{Name}.tsx` в `components/guides/contest/` и страницу под `app/guides/contest/{slug}/`.

## Контракт обёртки (для анимаций)

Рекомендуется на корневом элементе скина:

- `data-guide-skin="<id>"` — стабильный селектор для CSS/Framer Motion (пример: Лиза — `data-guide-skin="lisa"`).
- Проп `className?: string` — проброс снаружи, чтобы навешивать классы анимации без правок внутри скина.

Пример потребления:

```tsx
<GuideSkinOledja className="motion-safe:opacity-0 motion-safe:animate-in">
  {…контент гайда…}
</GuideSkinOledja>
```

## Существующие компоненты контента

| Компонент | Путь | Назначение |
|-----------|------|------------|
| `GuideLayout` | `components/guides/GuideLayout.tsx` | Базовый layout портала: хлебные крошки, статья, `GuideToc`, мета, шаринг |
| `GuideSection` | `components/guides/GuideSection.tsx` | Секция с `id` для якорей и `title` |
| `GuideCallout` | `components/guides/GuideCallout.tsx` | Выноски: `important`, `deadline`, `risk`, `tip`, `policy`; опционально `colorKey` |
| `GuideTable` | `components/guides/GuideTable.tsx` | Таблица с горизонтальным скроллом на мобильных |
| `GuideChecklist` | `components/guides/GuideChecklist.tsx` | Чеклист |
| `GuideFAQ` | `components/guides/GuideFAQ.tsx` | FAQ |
| `GuideCTA` | `components/guides/GuideCTA.tsx` | Кнопки-ссылки с событием аналитики |
| `GuideToc` | `components/guides/GuideToc.tsx` | Оглавление: sticky desktop + `details` на mobile |
| `GuideBreadcrumbs` | `components/guides/GuideBreadcrumbs.tsx` | Крошки для обычных гайдов |
| `GuideShare` | `components/guides/GuideShare.tsx` | Шаринг |

Конкурсный скин **Лиза** (`GuideSkinLisa`) использует собственные `LisaSection` / `LisaCallout` под стиль Younote — это нормальный паттерн, если нужна другая типографика.

## Мета и реестр

- Публичные гайды портала перечислены в `lib/guides.ts` (`GUIDES_REGISTRY`).
- Конкурсные демо можно **не** добавлять в реестр, чтобы не смешивать ленту на `/content` с жюри-страницами. Список конкурса: `/guides/contest`.

## Тема и цвета

- Общие токены направлений/комитетов: `lib/theme.ts` (`ColorKey`, `gradientBg`, `committeeBadgeClasses`, …).
- Tailwind: `tailwind.config.js` — цвета `oss`, градиенты направлений, кастомный вариант `light:` (класс `.light` на `<html>`).

Учитывайте **оба** режима: на `<html>` переключаются классы `light` и `dark` (см. `setTheme` в `lib/theme.ts`).

## Аналитика

- `lib/guideAnalytics.ts` — `trackGuideEvent(event, payload)`.
- События уже используются в `GuideLayout` (глубина скролла), `GuideCTA`, `GuideFAQ` и др. Для нового скина при необходимости вызывайте те же события из клиентских подкомпонентов (`'use client'`).

## Анимации: практические советы

- Предпочтительно **CSS** (`transition`, `@keyframes`) или **Framer Motion** только на оболочке и декоративных элементах, чтобы не ломать доступность.
- Уважайте `prefers-reduced-motion`: отключайте или упрощайте анимации.
- Безопасные зоны: hover карточек, появление боковой панели, индикатор прогресса чтения по `scroll`, лёгкий `fade-in` первого экрана.
- Избегайте постоянных крупных движений текста основного содержимого.

## Маршруты конкурса (текущие)

| URL | Статус |
|-----|--------|
| `/guides/contest` | Индекс |
| `/guides/contest/lisa/disputes-commission` | Готовый гайд + референс-PNG |
| `/guides/contest/danik` | Заглушка |
| `/guides/contest/german` | Заглушка |
| `/guides/contest/oledja` | Заглушка + этот документ |

## Референсы Лизы (статика)

Файлы в `public/guides/contest/lisa/`: `part-1.png` … `part-4.png`, опционально `cover.png`.
