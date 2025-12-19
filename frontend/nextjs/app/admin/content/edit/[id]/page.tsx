'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient';
import { DIRECTIONS } from '../../../../../lib/directions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '../../../../../components/ToastProvider';

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<'news' | 'guide' | 'faq'>('news');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [directionSlug, setDirectionSlug] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (contentId === 'new') {
      setLoading(false);
      return;
    }

    loadContent();
  }, [contentId]);

  async function loadContent() {
    try {
      const { data, error: fetchError } = await supabase
        .from('content')
        .select('*, directions!inner(slug)')
        .eq('id', contentId)
        .single();

      if (fetchError) {
        setError('Не удалось загрузить материал');
        return;
      }

      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setBody(data.body);
        setType(data.type);
        setStatus(data.status);
        setDirectionSlug((data.directions as any)?.slug || '');
      }
    } catch (err) {
      setError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!title.trim() || !slug.trim() || !body.trim()) {
      setError('Заполните все обязательные поля');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Получаем direction_id если указан slug
      let directionId = null;
      if (directionSlug) {
        const { data: dirData } = await supabase
          .from('directions')
          .select('id')
          .eq('slug', directionSlug)
          .single();

        if (dirData) {
          directionId = dirData.id;
        }
      }

      const data: any = {
        title: title.trim(),
        slug: slug.trim(),
        body: body.trim(),
        type,
        status,
        direction_id: directionId,
      };

      if (status === 'published' && contentId === 'new') {
        data.published_at = new Date().toISOString();
      }

      if (contentId === 'new') {
        const { error: insertError } = await supabase.from('content').insert(data);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('content')
          .update(data)
          .eq('id', contentId);
        if (updateError) throw updateError;
      }

      toast.success(contentId === 'new' ? 'Материал создан' : 'Материал сохранён');
      router.push('/admin/content');
    } catch (err: any) {
      const errorMessage = err.message || 'Ошибка при сохранении';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  // Автогенерация slug из заголовка
  useEffect(() => {
    if (contentId === 'new' && title && !slug) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-zа-яё0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(autoSlug);
    }
  }, [title, contentId, slug]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center text-white/50">Загрузка...</div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">
          {contentId === 'new' ? 'Создать материал' : 'Редактировать материал'}
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white"
        >
          Отмена
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Тип материала <span className="text-red-400">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
            >
              <option value="news">Новость</option>
              <option value="guide">Гайд</option>
              <option value="faq">FAQ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Статус <span className="text-red-400">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
              <option value="archived">Архив</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Направление (опционально)
          </label>
          <select
            value={directionSlug}
            onChange={(e) => setDirectionSlug(e.target.value)}
            className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
          >
            <option value="">Не указано</option>
            {DIRECTIONS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Заголовок <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white"
            placeholder="Введите заголовок"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Slug (URL) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
            className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white font-mono"
            placeholder="url-slug"
          />
          <p className="mt-1 text-xs text-white/50">
            Используется в URL. Автоматически генерируется из заголовка, можно изменить вручную.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              Содержание (Markdown) <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1.5 rounded-lg border border-white/20 text-sm text-white/80 hover:text-white hover:border-white/40 transition"
            >
              {showPreview ? 'Редактировать' : 'Предпросмотр'}
            </button>
          </div>
          {showPreview ? (
            <div className="w-full rounded-xl bg-white/10 p-6 border border-white/20 min-h-[400px] max-h-[600px] overflow-y-auto markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 text-white light:text-gray-900" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-2xl font-semibold mt-6 mb-3 text-white light:text-gray-900" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-xl font-semibold mt-4 mb-2 text-white light:text-gray-900" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mt-4 leading-relaxed text-white/80 light:text-gray-700" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc ml-6 mt-2 space-y-1" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal ml-6 mt-2 space-y-1" {...props} />
                  ),
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code
                        className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-white/90 light:bg-gray-100 light:text-gray-800"
                        {...props}
                      />
                    ) : (
                      <code
                        className="block bg-white/5 p-4 rounded-xl overflow-x-auto text-sm font-mono text-white/90 light:bg-gray-100 light:text-gray-800"
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
                      className="border-l-4 border-white/20 pl-4 italic my-4 text-white/70 light:border-gray-300 light:text-gray-600"
                      {...props}
                    />
                  ),
                }}
              >
                {body || '*Начните вводить текст...*'}
              </ReactMarkdown>
            </div>
          ) : (
            <>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white font-mono h-96"
                placeholder="Введите текст в формате Markdown..."
              />
              <div className="mt-2 text-xs text-white/50 space-y-1">
                <p><strong>Подсказки по форматированию:</strong></p>
                <p>• Заголовки: # Заголовок 1, ## Заголовок 2, ### Заголовок 3</p>
                <p>• Жирный текст: **текст**</p>
                <p>• Курсив: *текст*</p>
                <p>• Списки: - Пункт 1, - Пункт 2</p>
                <p>• Ссылки: [текст](https://ссылка)</p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-oss-red font-semibold hover:bg-oss-red/90 transition disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white"
          >
            Отмена
          </button>
        </div>
      </div>
    </main>
  );
}
