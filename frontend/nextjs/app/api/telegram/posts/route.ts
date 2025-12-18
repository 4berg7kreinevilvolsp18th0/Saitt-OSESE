import { NextResponse } from 'next/server';

// API endpoint для получения постов из Telegram канала
// Для работы требуется настройка Telegram Bot API или использование RSS

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel') || 'oss_dvfu';
  const limit = parseInt(searchParams.get('limit') || '5');

  try {
    // Вариант 1: Использование Telegram Bot API
    // Требует TELEGRAM_BOT_TOKEN в переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (botToken) {
      // Получаем информацию о канале
      const channelInfo = await fetch(
        `https://api.telegram.org/bot${botToken}/getChat?chat_id=@${channel}`
      );
      
      if (!channelInfo.ok) {
        throw new Error('Не удалось получить информацию о канале');
      }

      // Получаем последние сообщения из канала
      // Примечание: Bot API не позволяет напрямую получать сообщения из каналов
      // Нужно использовать другой подход (см. документацию ниже)
    }

    // Вариант 2: Использование RSS feed (если канал публичный)
    // Многие публичные каналы имеют RSS feed
    const rssUrl = `https://rss.app/v1/channels/${channel}/feed`;
    
    try {
      const rssResponse = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      if (rssResponse.ok) {
        const rssText = await rssResponse.text();
        // Парсинг RSS (требует библиотеку для парсинга XML/RSS)
        // Для простоты возвращаем заглушку
      }
    } catch (rssError) {
      // RSS недоступен, используем заглушку
    }

    // Временная заглушка - в реальности нужно подключить один из методов выше
    // Или использовать сторонний сервис для получения постов из Telegram
    // Канал ОСС ДВФУ: https://t.me/oss_dvfu (2 813 подписчиков)
    const mockPosts = [
      {
        id: '1',
        date: Date.now() - 3600000, // 1 час назад
        text: 'Добро пожаловать в официальный канал ОСС ДВФУ! Представляем студентов, защищаем их права, поддерживаем студенческие инициативы и развиваем ДВФУ.',
        link: `https://t.me/${channel}`,
      },
      {
        id: '2',
        date: Date.now() - 7200000, // 2 часа назад
        text: 'Следите за обновлениями и будьте в курсе всех событий студенческого самоуправления ДВФУ. Наше болото: @fareasternswamp',
        link: `https://t.me/${channel}`,
      },
    ].slice(0, limit);

    return NextResponse.json({
      posts: mockPosts,
      channel: `@${channel}`,
      channelUrl: `https://t.me/${channel}`,
    });
  } catch (error: any) {
    console.error('Ошибка получения постов Telegram:', error);
    return NextResponse.json(
      {
        error: 'Не удалось загрузить посты из Telegram',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

