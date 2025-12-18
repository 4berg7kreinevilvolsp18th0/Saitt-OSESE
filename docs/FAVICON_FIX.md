# Исправление ошибки 404 для favicon.ico

## Проблема

Браузер показывает ошибку:
```
/favicon.ico:1 Failed to load resource: the server responded with a status of 404 ()
```

## Решение

### Вариант 1: Проверка файла favicon.ico

1. Убедитесь, что файл `frontend/nextjs/public/favicon.ico` существует
2. Проверьте, что это валидный ICO файл (не текстовый файл)
3. Размер файла должен быть больше 0 байт

### Вариант 2: Создание нового favicon

Если файл повреждён или отсутствует:

1. Создайте новый favicon.ico (16x16 или 32x32 пикселей)
2. Поместите его в `frontend/nextjs/public/favicon.ico`
3. Или используйте один из логотипов:
   ```bash
   # Скопируйте один из логотипов как favicon
   cp "frontend/nextjs/public/Лого вектор красное.png" "frontend/nextjs/public/favicon.png"
   ```

### Вариант 3: Использование PNG вместо ICO

В Next.js можно использовать PNG для favicon:

1. Создайте `frontend/nextjs/app/icon.png` (32x32 или 16x16)
2. Или обновите `layout.tsx`:
   ```typescript
   icons: {
     icon: '/favicon.png',
     shortcut: '/favicon.png',
     apple: '/favicon.png',
   },
   ```

## Проверка

После исправления:

1. Очистите кеш браузера (Ctrl+Shift+Delete)
2. Или откройте в режиме инкогнито
3. Проверьте, что favicon загружается:
   ```
   https://ваш-домен.vercel.app/favicon.ico
   ```

## Что уже исправлено в коде

✅ Добавлен favicon в metadata (`icons` в `layout.tsx`)
✅ Добавлены явные ссылки на favicon в `<head>`
✅ Файл должен быть в `public/favicon.ico`

## Если проблема сохраняется

1. Проверьте логи Vercel - возможно, файл не загружается
2. Убедитесь, что файл не в `.gitignore`
3. Проверьте, что файл действительно бинарный (не текстовый)

