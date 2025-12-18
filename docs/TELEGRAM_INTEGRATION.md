# Интеграция с Telegram каналом

## Обзор

Компонент `TelegramPosts` позволяет отображать последние посты из Telegram канала на сайте.

## Настройка

### Вариант 1: Использование Telegram Bot API (рекомендуется)

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Добавьте бота в ваш Telegram канал как администратора
4. Создайте API endpoint для получения постов

### Вариант 2: Использование RSS (если канал публичный)

Если ваш Telegram канал публичный, можно использовать RSS feed:
- URL формата: `https://rss.app/v1/channels/{channel_id}/feed`

### Вариант 3: Использование Telegram Public Channel API

Для публичных каналов можно использовать неофициальные API.

## Переменные окружения

Добавьте в `.env.local` и Vercel:

```env
NEXT_PUBLIC_TELEGRAM_CHANNEL=oss_dvfu
NEXT_PUBLIC_TELEGRAM_API_URL=/api/telegram/posts  # или ваш внешний API
TELEGRAM_BOT_TOKEN=your-bot-token  # только на сервере, не NEXT_PUBLIC_!
```

**Канал ОСС ДВФУ:** [@oss_dvfu](https://t.me/oss_dvfu)
- 2 813 подписчиков
- Официальный канал Объединённого совета студентов ДВФУ

## Использование компонента

```tsx
import TelegramPosts from '../components/TelegramPosts';

<TelegramPosts 
  channel="@oss_dvfu"  // опционально, по умолчанию из env
  limit={5}            // количество постов
/>
```

## Создание API endpoint для Telegram

Создайте API route в `app/api/telegram/posts/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel') || '@oss_dvfu';
  const limit = parseInt(searchParams.get('limit') || '5');

  // Здесь используйте Telegram Bot API или другой метод
  // Пример с Telegram Bot API:
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = channel.replace('@', '');
  
  // Получение постов через Telegram Bot API
  // const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
  
  // Возвращаем посты
  return NextResponse.json({
    posts: [
      {
        id: '1',
        date: Date.now(),
        text: 'Пример поста из Telegram',
        link: `https://t.me/${channelId}/1`,
      },
    ],
  });
}
```

## Безопасность

⚠️ **ВАЖНО:** Никогда не храните Telegram Bot Token в клиентском коде!

- Используйте серверные API routes для запросов к Telegram API
- Храните токены только в переменных окружения на сервере
- Не используйте `NEXT_PUBLIC_` префикс для секретных токенов

## Примеры сервисов для интеграции

1. **Telegram Bot API** - официальный API
2. **Telegram RSS** - для публичных каналов
3. **Telegram Public Channel API** - неофициальные сервисы

## Обновление компонента

Компонент `TelegramPosts` готов к использованию, но требует настройки API endpoint для получения реальных постов из Telegram.

