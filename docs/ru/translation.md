
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
