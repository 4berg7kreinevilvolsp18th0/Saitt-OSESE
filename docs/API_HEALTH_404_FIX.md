# Исправление ошибки 404 для /api/health

## Проблема

Endpoint `/api/health` возвращает 404:
```
GET https://ваш-домен.vercel.app/api/health 404 (Not Found)
```

## Возможные причины

### 1. Файл не был закоммичен и запушен

**Решение:**
```bash
git add frontend/nextjs/app/api/health/route.ts
git commit -m "Add health check API endpoint"
git push
```

### 2. Vercel не видит файл после деплоя

**Проверка:**
1. Vercel Dashboard → ваш проект → **Deployments**
2. Откройте последний деплой
3. Проверьте **Build Logs** - должны быть упоминания о `/api/health`
4. Если файл не найден - перезапустите деплой

### 3. Неправильный Root Directory в Vercel

**Проверка:**
1. Vercel Dashboard → ваш проект → **Settings** → **General**
2. Убедитесь, что **Root Directory** = `frontend/nextjs`
3. Если нет - измените и перезапустите деплой

### 4. Файл не в правильной структуре

**Проверка структуры:**
```
frontend/nextjs/
  app/
    api/
      health/
        route.ts  ← должен быть здесь
```

## Проверка локально

Перед деплоем проверьте локально:

```bash
cd frontend/nextjs
npm run dev
```

Затем откройте:
```
http://localhost:3000/api/health
```

Должен вернуться JSON:
```json
{
  "status": "ok",
  "timestamp": "...",
  "supabase": { ... }
}
```

## Альтернативный endpoint

Если `/api/health` не работает, можно использовать простой тест:

Создайте `frontend/nextjs/app/api/test/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API работает!' });
}
```

Проверьте: `https://ваш-домен.vercel.app/api/test`

## Проверка после деплоя

1. Убедитесь, что файл закоммичен:
   ```bash
   git log --oneline --all | grep health
   ```

2. Проверьте, что файл в репозитории:
   ```bash
   git ls-files | grep api/health
   ```

3. После деплоя проверьте логи Vercel:
   - Должны быть сообщения о сборке API routes
   - Не должно быть ошибок компиляции

## Если проблема сохраняется

1. Удалите и создайте endpoint заново
2. Проверьте, что используется Next.js 14+ (App Router)
3. Убедитесь, что `route.ts` экспортирует правильные функции (`GET`, `POST` и т.д.)

