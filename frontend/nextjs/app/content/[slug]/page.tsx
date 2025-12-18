'use client';

import React, { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Badge from '../../../components/Badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../../../lib/supabaseClient';

export default function ContentItem() {
  const params = useParams();
  const slug = params.slug as string;
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [slug]);

  async function loadContent() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('content')
        .select('id, type, title, slug, body, published_at, direction_id')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (fetchError || !data) {
        setError('Контент не найден');
        return;
      }

      setContent(data);
    } catch (err) {
      setError('Произошла ошибка при загрузке');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center text-white/50">Загрузка...</div>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
          {error || 'Контент не найден'}
        </div>
      </main>
    );
  }

  const contentType = content.type as 'news' | 'guide' | 'faq';
  const title = content.title || slug;
  const body = content.body || '';

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <article>
        <div className="mb-6">
          <Badge variant={contentType === 'news' ? 'info' : contentType === 'guide' ? 'success' : 'warning'}>
            {contentType === 'news' ? 'Новость' : contentType === 'guide' ? 'Гайд' : 'FAQ'}
          </Badge>
        </div>
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        {content.published_at && (
          <p className="text-white/50 mb-8">
            Опубликовано: {new Date(content.published_at).toLocaleDateString('ru-RU')}
          </p>
        )}
        <div className="prose prose-invert prose-lg max-w-none text-white/80 markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="mt-4 leading-relaxed" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc ml-6 mt-2 space-y-1" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal ml-6 mt-2 space-y-1" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="ml-2" {...props} />
              ),
              code: ({ node, inline, ...props }: any) =>
                inline ? (
                  <code
                    className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  />
                ) : (
                  <code
                    className="block bg-white/5 p-4 rounded-xl overflow-x-auto text-sm font-mono"
                    {...props}
                  />
                ),
              a: ({ node, ...props }) => (
                <a
                  className="text-oss-red hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-white/20 pl-4 italic my-4 text-white/70"
                  {...props}
                />
              ),
            }}
          >
            {body}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
