# Фоны направлений и декоративные элементы

## Обзор

  - Ellipse 3: `#1C9C65`, opacity 0.6, blur 150px
  - Ellipse 4: `#1C9C65`, blur 100px

### Градиент
- **Тёмная тема:** `linear-gradient(135deg, #251D1D 0%, #2D2525 50%, #251D1D 100%)`
- **Светлая тема:** `linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #D1FAE5 100%)`

## 4. Иностранным студентам (International)

### Основной фон
- **Цвет:** `#2B2121` (тёмно-коричневый)

### Декоративные элементы
- **Group 1:**
  - Ellipse 5: `#EB9D2F` (оранжевый), opacity 0.2, blur 600px
  - Ellipse 1: `#EB9D2F`, opacity 0.7, blur 400px
  - Ellipse 3: `#EB9D2F`, opacity 0.6, blur 150px
  - Ellipse 4: `#EB9D2F`, blur 100px
  
- **Group 2:**
  - Ellipse 6: `#EDAE26` (золотой), opacity 0.2, blur 600px
  - Ellipse 1: `#EDAE26`, opacity 0.7, blur 400px
  - Ellipse 3: `#EDAE26`, opacity 0.6, blur 150px
  - Ellipse 4: `#EDAE26`, blur 100px

### Градиент
- **Тёмная тема:** `linear-gradient(135deg, #2B2121 0%, #3D2F2F 50%, #2B2121 100%)`
- **Светлая тема:** `linear-gradient(135deg, #FFF4E6 0%, #FFE4B5 50%, #FFF4E6 100%)`

## 5. Объединение / Другое (Neutral)

### Основной фон
- **Цвет:** `#241E34` (тёмно-фиолетовый)

### Декоративные элементы
- **Group 1:**
  - Ellipse 5: `#C240FF` (фиолетовый), opacity 0.2, blur 600px
  - Ellipse 1: `#C240FF`, opacity 0.7, blur 400px
  - Ellipse 3: `#C240FF`, opacity 0.6, blur 150px
  - Ellipse 4: `#C240FF`, blur 100px
  
- **Group 2:**
  - Ellipse 6: `#D026D9` (маджента), opacity 0.2, blur 600px
  - Ellipse 1: `#D026D9`, opacity 0.7, blur 400px
  - Ellipse 3: `#D026D9`, opacity 0.6, blur 150px
  - Ellipse 4: `#D026D9`, blur 100px

### Градиент
- **Тёмная тема:** `linear-gradient(135deg, #241E34 0%, #2D2540 50%, #241E34 100%)`
- **Светлая тема:** `linear-gradient(135deg, #FEE2E2 0%, #FECACA 50%, #FEE2E2 100%)`

## Технические детали

### Размеры элементов
- **Большие эллипсы:** 1088px × 1088px и 1258px × 1258px
- **Средние эллипсы:** 660px × 660px и 763px × 763px

### Эффекты размытия
- **Очень сильное:** blur 600px (для фоновых элементов)
- **Сильное:** blur 400px (для основных элементов)
- **Среднее:** blur 150px (для акцентов)
- **Слабое:** blur 100px (для деталей)

### Прозрачность
- **Фоновые элементы:** opacity 0.2
- **Основные элементы:** opacity 0.7
- **Акценты:** opacity 0.6
- **Детали:** opacity 1.0

## Использование в коде

### Tailwind классы
```tsx
// Основной фон направления
<div className="bg-legal"> // или bg-infrastructure, bg-scholarship и т.д.

// Декоративные элементы
<div className="bg-legal-blur-1 opacity-20 blur-[600px]">
<div className="bg-legal-blur-2 opacity-70 blur-[400px]">
```

### Функции из lib/theme.ts
```tsx
import { gradientBg, getBlurColor1, getBlurColor2 } from '@/lib/theme';

const gradient = gradientBg('legal');
const blur1 = getBlurColor1('legal');
const blur2 = getBlurColor2('legal');
```

## Визуальная структура

Каждый фон состоит из:
1. **Основного фона** - тёмный цвет, создающий базу
2. **Group 1** - первый набор размытых элементов (4 эллипса разных размеров)
3. **Group 2** - второй набор размытых элементов (4 эллипса разных размеров)

Элементы расположены в разных позициях и с разными уровнями размытия для создания глубины и атмосферы.

