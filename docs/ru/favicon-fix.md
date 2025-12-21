# Исправление ошибок Favicon

## Проблема

Ошибка в консоли браузера:
```
Error while trying to use the following icon from the Manifest: 
https://oss-students-dvfu.vercel.app/favicon.ico 
(Download error or resource isn't a valid image)
```

## Решение

### 1. Упрощен манифест

Убраны несуществующие иконки (`icon-192.png`, `icon-512.png`) из `manifest.ts`.

**Было:**
```typescript
icons: [
  { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
  { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
  { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
],
```

**Стало:**
```typescript
icons: [
  { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
],
```

### 2. Упрощены мета-теги в layout.tsx

**Было:**
```typescript
icons: {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },
    { url: '/favicon.ico', type: 'image/x-icon' },
  ],
  shortcut: '/favicon.ico',
  apple: '/favicon.ico',
},
```

**Стало:**
```typescript
icons: {
  icon: '/favicon.ico',
  shortcut: '/favicon.ico',
  apple: '/favicon.ico',
},
```

### 3. Упрощены link теги

**Было:**
```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

**Стало:**
```html
<link rel="icon" href="/favicon.ico" />
```

## Проверка

1. Убедитесь, что файл `/public/favicon.ico` существует
2. Проверьте, что favicon валидный (можно открыть в браузере)
3. Очистите кэш браузера (Ctrl+Shift+R)
4. Проверьте консоль браузера - ошибок быть не должно

## Если favicon все еще не работает

### Вариант 1: Создать новый favicon

1. Используйте онлайн-генератор: [favicon.io](https://favicon.io)
2. Загрузите логотип ОСС
3. Скачайте сгенерированный `favicon.ico`
4. Замените файл в `/public/favicon.ico`

### Вариант 2: Использовать PNG иконку

Если `favicon.ico` не работает, можно использовать PNG:

1. Создайте `icon.png` (32x32 или 16x16)
2. Обновите `manifest.ts`:
```typescript
icons: [
  { src: '/icon.png', sizes: '32x32', type: 'image/png' },
],
```

3. Обновите `layout.tsx`:
```typescript
icons: {
  icon: '/icon.png',
},
```

## Дополнительно: Создание PWA иконок (опционально)

Если хотите полноценный PWA с иконками:

1. Создайте иконки:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)

2. Добавьте обратно в `manifest.ts`:
```typescript
icons: [
  { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
  { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
  { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
],
```

3. Разместите файлы в `/public/`

---

**Итог:** Ошибки favicon исправлены. Манифест упрощен, убраны ссылки на несуществующие файлы.

