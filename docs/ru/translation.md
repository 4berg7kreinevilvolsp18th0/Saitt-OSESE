# Переводы сайта

Как работать с переводами и добавлять новые языки на сайте ОСС ДВФУ.

## Где хранятся переводы

Все переводы находятся в папке `frontend/nextjs/locales/`:
- `ru.json` — русский язык (основной)
- `en.json` — английский язык

## Как это работает

В коде используется система переводов через React Context:
- `LocaleProvider` — компонент, который предоставляет переводы всему приложению
- `useLocale()` — хук для доступа к переводам в компонентах
- `t(key)` — функция для получения перевода по ключу

### Пример использования

```typescript
'use client';

import { useLocale } from '../components/LocaleProvider';

export default function MyComponent() {
  const { t } = useLocale();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
    </div>
  );
}
```

## Формат файлов переводов

Файлы организованы по разделам сайта:

```json
{
  "common": {
    "loading": "Загрузка...",
    "error": "Ошибка"
  },
  "navigation": {
    "home": "Главная",
    "directions": "Направления"
