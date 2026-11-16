'use client';

import { useEffect, useState } from 'react';
import { TELEGRAM_CHANNEL } from '../lib/publicContacts';

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

const apiUrl = process.env.NEXT_PUBLIC_TELEGRAM_API_URL;

export default function TelegramPosts({ channel = TELEGRAM_CHANNEL, limit = 5 }: TelegramPostsProps) {
  const channelName = channel.replace(/^@/, '');
  const [posts, setPosts] = useState<TelegramPost[]>([]);

  useEffect(() => {
    if (!apiUrl) return;
    const controller = new AbortController();
    setPosts([]);

    async function loadPosts() {
      try {
        const endpoint = new URL(apiUrl, window.location.origin);
        endpoint.searchParams.set('channel', channelName);
        endpoint.searchParams.set('limit', String(limit));
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) return;
        const payload = await response.json();
        if (Array.isArray(payload?.posts) && !controller.signal.aborted) {
          setPosts(payload.posts.slice(0, limit));
        }
      } catch {
        // Ссылка на канал доступна независимо от состояния ленты.
      }
    }

    void loadPosts();
    return () => controller.abort();
  }, [channelName, limit]);

  return (
    <aside aria-label="ОСС в Telegram" className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 light:bg-white light:border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold light:text-gray-900">ОСС в Telegram</h3>
      <p className="text-sm text-white/75 light:text-gray-600">
        Анонсы, новости и обновления совета.
      </p>
      <a
        href={`https://t.me/${channelName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-10 items-center rounded-lg font-semibold underline focus-ring"
      >
        Открыть канал ↗
      </a>
      {posts.length > 0 && (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200">
              <p className="text-sm line-clamp-3 break-words">{post.text}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/70 light:text-gray-600">
                <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
                {post.link?.startsWith('https://t.me/') && (
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="underline focus-ring">
                    Читать ↗
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
