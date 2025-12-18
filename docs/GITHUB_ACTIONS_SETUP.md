# Настройка автоматического деплоя через GitHub Actions

## Вариант 1: Автоматический деплой через Vercel (Рекомендуется)

Vercel имеет встроенную интеграцию с GitHub, которая автоматически деплоит при каждом пуше.

### Настройка:

1. **В Vercel Dashboard:**
   - Зайдите в Settings → Git
   - Подключите ваш GitHub репозиторий
   - Выберите ветку для деплоя (обычно `main`)
   - Укажите Root Directory: `frontend/nextjs`
   - Vercel автоматически создаст webhook и будет деплоить при каждом пуше

2. **Преимущества:**
   - Автоматические деплои при пуше в main
   - Preview деплои для Pull Requests
   - Автоматическая отмена деплоев при мердже
   - Не требует настройки GitHub Actions

## Вариант 2: GitHub Actions для Vercel

Если вы хотите больше контроля над процессом деплоя.

### Настройка:

1. **Получите токены Vercel:**
   - Зайдите в Vercel Dashboard → Settings → Tokens
   - Создайте новый токен
   - Скопируйте его

2. **Получите ID проекта и организации:**
   - В Vercel Dashboard откройте ваш проект
   - В URL или в Settings → General найдите:
     - `Vercel Project ID`
     - `Vercel Organization ID`

3. **Добавьте Secrets в GitHub:**
   - Зайдите в ваш репозиторий на GitHub
   - Settings → Secrets and variables → Actions
   - Добавьте следующие secrets:
     ```
     VERCEL_TOKEN = ваш-vercel-token
     VERCEL_ORG_ID = ваш-org-id
     VERCEL_PROJECT_ID = ваш-project-id
     NEXT_PUBLIC_SUPABASE_URL = ваш-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY = ваш-supabase-key
     NEXT_PUBLIC_SITE_URL = https://ваш-сайт.vercel.app
     ```

4. **Workflow файлы:**
   - `.github/workflows/deploy.yml` - автоматический деплой на Vercel
   - `.github/workflows/ci.yml` - проверка сборки при PR
   - `.github/workflows/vercel-integration.yml` - альтернативный вариант деплоя

## Вариант 3: GitHub Actions для других платформ

Если вы хотите деплоить на другую платформу (например, собственный сервер).

### Пример для деплоя на сервер:

Создайте `.github/workflows/deploy-server.yml`:

```yaml
name: Deploy to Server

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./frontend/nextjs
        run: npm ci
      
      - name: Build
        working-directory: ./frontend/nextjs
        run: npm run build
      
      - name: Deploy to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: "./frontend/nextjs/.next"
          target: "/var/www/oss-dvfu"
```

## Настройка веток

### Production (main/master):
- Автоматический деплой на production
- Требует успешного прохождения CI

### Staging (develop):
- Автоматический деплой на staging окружение
- Используется для тестирования

### Pull Requests:
- Preview деплои (если настроено в Vercel)
- Проверка сборки через CI

## Мониторинг деплоев

1. **GitHub Actions:**
   - Зайдите в репозиторий → Actions
   - Видите все запуски workflow
   - Логи и статус каждого деплоя

2. **Vercel Dashboard:**
   - Deployments - все деплои
   - Logs - логи сборки и деплоя
   - Analytics - метрики производительности

## Troubleshooting

### Деплой не запускается:
- Проверьте, что workflow файлы находятся в `.github/workflows/`
- Убедитесь, что secrets добавлены правильно
- Проверьте логи в GitHub Actions

### Ошибка сборки:
- Проверьте переменные окружения
- Убедитесь, что все зависимости установлены
- Проверьте логи сборки

### Vercel не деплоит:
- Проверьте подключение репозитория в Vercel
- Убедитесь, что Root Directory указан правильно
- Проверьте настройки веток в Vercel

## Рекомендации

1. **Используйте Vercel интеграцию** для простоты
2. **Настройте CI** для проверки перед деплоем
3. **Используйте Preview деплои** для тестирования
4. **Настройте уведомления** о статусе деплоев

