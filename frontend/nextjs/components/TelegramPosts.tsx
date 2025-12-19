'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface TelegramPost {
  id: string;
  date: number;
  text: string;
  link?: string;
}

interface TelegramPostsProps {
  channel?: string;
  limit?: number;
}

export default function TelegramPosts({ 
  channel = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL || 'oss_dvfu', // Канал ОСС ДВФУ: https://t.me/oss_dvfu
  limit = 5 
}: TelegramPostsProps) {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Для получения постов из Telegram можно использовать:
    // 1. Telegram Bot API (требует токен бота)
    // 2. RSS feed канала (если включен)
    // 3. Telegram Public Channel API (если канал публичный)
    
    // Временная заглушка - в реальности нужно подключить Telegram API
    async function loadTelegramPosts() {
      try {
        setLoading(true);
        
        // Используем наш API endpoint для получения постов
        const apiUrl = process.env.NEXT_PUBLIC_TELEGRAM_API_URL || '/api/telegram/posts';
        const channelName = channel.replace('@', '');
        
        const response = await fetch(`${apiUrl}?channel=${channelName}&limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        } else {
          // Если API недоступен, показываем приветственное сообщение с ссылкой на канал
          setPosts([
            {
              id: '1',
              date: Date.now() - 3600000,
              text: 'Добро пожаловать в официальный канал ОСС ДВФУ! Представляем студентов, защищаем их права, поддерживаем студенческие инициативы и развиваем ДВФУ. Подписывайтесь на @oss_dvfu, чтобы быть в курсе всех событий!',
              link: `https://t.me/${channelName}`,
            },
          ]);
        }
      } catch (err: any) {
        console.error('Ошибка загрузки постов Telegram:', err);
        setError('Не удалось загрузить посты из Telegram');
      } finally {
        setLoading(false);
      }
    }

    loadTelegramPosts();
  }, [channel, limit]);

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="text-center text-white/50">
          Загрузка постов из Telegram...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-white/70 mb-4">
          Пока нет новых постов в Telegram
        </p>
        <Link
          href={`https://t.me/${channel.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-oss-red hover:underline"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Подписаться на канал
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg sm:text-xl font-semibold text-white">
          Новое в Telegram
        </h3>
        <Link
          href={`https://t.me/${channel.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs sm:text-sm text-oss-red hover:underline flex items-center gap-1"
        >
          Все посты
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-oss-red/20 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-oss-red" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {post.text}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-white/50 flex-wrap">
                  <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
                  {post.link && (
                    <Link
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-oss-red hover:underline"
                    >
                      Читать →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

