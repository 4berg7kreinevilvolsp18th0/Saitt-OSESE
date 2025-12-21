# Руководство по экспорту дизайна из Figma

## Быстрый старт

### 1. Установка плагинов Figma

#### Обязательные плагины:
1. **Figma Tokens** - экспорт дизайн-токенов
2. **Figma to Code** - генерация CSS/React
3. **Figma to Tailwind** - конвертация в Tailwind

#### Дополнительные плагины:
- **Figma Dev Mode** - просмотр спецификаций
- **Auto Layout** - для responsive компонентов
- **Component Properties** - для variants

### 2. Настройка дизайн-токенов

#### Создание Color Tokens
```
1. Выберите цвет в Figma
2. Правый клик → "Add to Color Styles"
3. Назовите по схеме: oss-red, legal-dark-blue и т.д.
4. Экспортируйте через Figma Tokens
```

#### Создание Text Styles
```
1. Выберите текст
2. Правый клик → "Add to Text Styles"
3. Назовите: h1, h2, body, caption и т.д.
4. Укажите все параметры (size, weight, spacing)
```

### 3. Экспорт в JSON

#### Использование Figma Tokens
```json
{
  "color": {
    "oss": {
      "red": {
        "value": "#D11F2A",
        "type": "color"
      },
      "dark": {
        "value": "#0F1115",
        "type": "color"
      }
    }
  },
  "typography": {
    "h1": {
      "fontSize": "3.5rem",
      "fontWeight": 700,
      "letterSpacing": "-0.03em"
    }
  }
}
```

## Экспорт компонентов

### Карточки направлений

#### Структура в Figma
```
DirectionCard (Component)
├── Variants:
│   ├── Theme: Dark / Light
│   ├── Direction: Legal / Infrastructure / Scholarship / International / Neutral
│   └── State: Default / Hover
├── Properties:
│   ├── Title (Text)
│   ├── Description (Text)
│   └── Color (Color)
```

#### Экспорт CSS
```css
.direction-card {
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  border: 2px solid;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.direction-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
```

### Кнопки

#### Структура в Figma
```
Button (Component)
├── Variants:
│   ├── Type: Primary / Secondary
│   ├── Size: Small / Medium / Large
│   └── State: Default / Hover / Active / Disabled
```

#### Экспорт Tailwind классов
```html
<!-- Primary Button -->
<button class="px-6 py-3 rounded-xl bg-gradient-to-r from-oss-red to-red-600 text-white font-semibold hover:shadow-lg">
  Подать обращение
</button>

<!-- Secondary Button -->
<button class="px-6 py-3 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10">
  Проверить статус
</button>
```

## Экспорт иконок и изображений

### Иконки
1. Выберите иконку в Figma
2. Экспорт → SVG
3. Оптимизируйте через SVGO
4. Сохраните в `public/icons/`

### Изображения
1. Выберите изображение
2. Экспорт → PNG/WebP
3. Оптимизируйте размер
4. Сохраните в `public/images/`

## Автоматизация экспорта

### Использование Figma API

#### Скрипт для экспорта токенов
```javascript
// figma-export.js
const figma = require('figma-api');

async function exportTokens() {
  const api = new figma.Api({ personalAccessToken: 'YOUR_TOKEN' });
  const file = await api.getFile('FILE_KEY');
  
  // Экспорт цветов, типографики и т.д.
  // Сохранение в JSON
}
```

### GitHub Actions для автоматизации
```yaml
name: Export Figma Design Tokens

on:
  workflow_dispatch:

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Export tokens
        run: node scripts/export-figma-tokens.js
      - name: Commit changes
        run: |
          git add design-tokens.json
          git commit -m "Update design tokens"
```

## Интеграция с Tailwind

### Конфигурация tailwind.config.js

#### Импорт токенов из Figma
```javascript
const designTokens = require('./design-tokens.json');

module.exports = {
  theme: {
    extend: {
      colors: {
        'oss-red': designTokens.color.oss.red.value,
        'oss-dark': designTokens.color.oss.dark.value,
        // ... остальные цвета
      },
      fontFamily: {
        'sf-display': ['SF UI Display', 'sans-serif'],
        'sf-text': ['SF UI Text', 'sans-serif'],
      },
      fontSize: {
        'h1': designTokens.typography.h1.fontSize,
        // ... остальные размеры
      }
    }
  }
}
```

## Спецификации для разработчика

### Что должно быть в макете

#### Для каждого компонента:
1. **Размеры**: точные значения в px/rem
2. **Отступы**: padding и margin
3. **Цвета**: hex коды
4. **Типографика**: размер, вес, межбуквенное расстояние
5. **Тени**: все параметры box-shadow
6. **Границы**: радиус, толщина, цвет
7. **Состояния**: hover, active, disabled
8. **Responsive**: как компонент ведет себя на разных экранах

### Пример спецификации

```
Button Primary
├── Size: 160px × 48px
├── Padding: 12px 24px
├── Border Radius: 12px
├── Background: Linear Gradient (#D11F2A → #B91C1C)
├── Text: White, Semibold, 16px
├── Shadow: 0 4px 12px rgba(209, 31, 42, 0.3)
└── Hover:
    ├── Shadow: 0 8px 24px rgba(209, 31, 42, 0.4)
    └── Transform: translateY(-2px)
```

## Чеклист перед передачей дизайна

### Дизайн-система
- [ ] Все цвета добавлены в Color Styles
- [ ] Все текстовые стили созданы
- [ ] Компоненты созданы с variants
- [ ] Auto Layout настроен правильно

### Компоненты
- [ ] Все состояния (default, hover, active)
- [ ] Responsive версии для всех breakpoints
- [ ] Темная и светлая тема
- [ ] Интерактивный прототип

### Документация
- [ ] Спецификации для каждого компонента
- [ ] Дизайн-токены экспортированы
- [ ] Комментарии в Figma добавлены
- [ ] Презентация подготовлена

### Экспорт
- [ ] Иконки экспортированы в SVG
- [ ] Изображения оптимизированы
- [ ] Дизайн-токены в JSON
- [ ] CSS/React код сгенерирован

## Полезные ссылки

- [Figma Tokens Plugin](https://www.figma.com/community/plugin/843461159747178946)
- [Figma to Code](https://www.figma.com/community/plugin/842128343887142055)
- [Figma Dev Mode](https://www.figma.com/dev-mode)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Успешной работы! 🚀**

