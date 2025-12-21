# Исправление ошибки 404 на Vercel (проект не найден)

## Проблема

Сайт показывает стандартную страницу Vercel 404:
```
404 : NOT_FOUND
Code: NOT_FOUND
```

Это означает, что Vercel не может найти или собрать ваш проект.

## Решение

### Шаг 1: Проверьте настройки проекта в Vercel

1. Зайдите в **Vercel Dashboard** → ваш проект
2. Перейдите в **Settings** → **General**
3. Проверьте следующие настройки:

#### ⚠️ КРИТИЧЕСКИ ВАЖНО: Root Directory

```
Root Directory: frontend/nextjs
```

**Если Root Directory пустой или указан неправильно:**
1. Нажмите "Edit"
2. Введите: `frontend/nextjs`
3. Сохраните изменения
4. Перезапустите деплой

#### Framework Preset

```
Framework Preset: Next.js
```

#### Build Settings

```
Build Command: npm run build (или оставьте пустым для автоопределения)
Output Directory: .next (или оставьте пустым для автоопределения)
Install Command: npm install (или оставьте пустым для автоопределения)
```

### Шаг 2: Проверьте подключение к GitHub

1. **Settings** → **Git**
2. Убедитесь, что репозиторий подключен
3. Проверьте, что указана правильная ветка (обычно `main` или `master`)

### Шаг 3: Проверьте структуру проекта в GitHub

Убедитесь, что в репозитории есть:
```
frontend/
  nextjs/
    package.json
    next.config.js
    app/
      layout.tsx
      page.tsx
```

### Шаг 4: Перезапустите деплой

1. **Deployments** → последний деплой
2. Нажмите **"..."** → **Redeploy**
3. Или сделайте новый push в GitHub:
   ```bash
   git add .
   git commit -m "Fix Vercel deployment"
   git push
   ```

### Шаг 5: Проверьте логи сборки

1. **Deployments** → последний деплой
2. Откройте **Build Logs**
3. Ищите ошибки:
   - `Error: Could not find a production build`
   - `Error: Cannot find module`
   - `Error: ENOENT: no such file or directory`

## Типичные ошибки

### Ошибка: "Could not find a production build"

**Причина:** Root Directory не указан или указан неправильно.

**Решение:**
1. Установите Root Directory = `frontend/nextjs`
2. Перезапустите деплой

### Ошибка: "Cannot find module 'next'"

**Причина:** Зависимости не установлены или установлены в неправильной директории.

**Решение:**
1. Убедитесь, что `package.json` находится в `frontend/nextjs/`
2. Проверьте, что в логах есть `npm install`
3. Если нет - добавьте в Build Settings:
   ```
   Install Command: cd frontend/nextjs && npm install
   Build Command: cd frontend/nextjs && npm run build
   ```

### Ошибка: "404 on all routes"

**Причина:** Next.js не собирается или собирается неправильно.

**Решение:**
1. Проверьте `next.config.js` - не должно быть `output: 'standalone'`
2. Убедитесь, что `app/` директория существует
3. Проверьте, что `app/layout.tsx` и `app/page.tsx` существуют

## Быстрая проверка

### Локально проверьте сборку:

```bash
cd frontend/nextjs
npm install
npm run build
```

Если сборка проходит успешно локально, но не работает на Vercel:
- Проверьте Root Directory
- Проверьте переменные окружения
- Проверьте логи Vercel

## После исправления

После настройки Root Directory и перезапуска деплоя:

1. Подождите 2-3 минуты (время сборки)
2. Проверьте сайт: `https://saitt-osese.vercel.app/`
3. Должна загрузиться главная страница сайта

## Если проблема сохраняется

1. Создайте новый проект в Vercel:
   - **Add New Project**
   - Импортируйте репозиторий заново
   - **ВАЖНО:** Укажите Root Directory = `frontend/nextjs` при создании

2. Проверьте, что все файлы закоммичены:
   ```bash
   git status
   git add .
   git commit -m "Ensure all files are committed"
   git push
   ```

3. Свяжитесь с поддержкой Vercel, если проблема не решается

