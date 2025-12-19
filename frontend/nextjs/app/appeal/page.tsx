'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { DIRECTIONS } from '../../lib/directions';

function AppealPageContent() {
  const params = useSearchParams();
  const presetDirection = params.get('direction');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [selectedDirection, setSelectedDirection] = useState<string>(presetDirection || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Укажите тему обращения';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Тема должна быть не менее 5 символов';
    }

    if (!description.trim()) {
      newErrors.description = 'Опишите ситуацию';
    } else if (description.trim().length < 20) {
      newErrors.description = 'Описание должно быть не менее 20 символов';
    }

    if (!contact.trim()) {
      newErrors.contact = 'Укажите контакт для связи';
    } else if (!/^[\w\.-]+@[\w\.-]+\.\w+$|^@[\w]+$/.test(contact.trim())) {
      newErrors.contact = 'Укажите email или Telegram (@username)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function submit() {
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Определяем тип контакта
      const contactType = contact.trim().startsWith('@') ? 'telegram' : 'email';

      // Получаем direction_id если выбрано направление
      let directionId = null;
      if (selectedDirection) {
        const { data: directionData, error: dirError } = await supabase
          .from('directions')
          .select('id')
          .eq('slug', selectedDirection)
          .eq('is_active', true)
          .single();

        if (!dirError && directionData) {
          directionId = directionData.id;
        }
      }

      const { data, error } = await supabase
        .from('appeals')
        .insert({
          title: title.trim(),
          description: description.trim(),
          contact_value: contact.trim(),
          contact_type: contactType,
          direction_id: directionId,
          is_anonymous: isAnonymous,
        })
        .select('public_token')
        .single();

      if (error) {
        setErrors({ submit: error.message || 'Ошибка при отправке обращения. Попробуйте позже.' });
        setIsSubmitting(false);
        return;
      }

      if (data) {
        setSubmittedToken(data.public_token);
      }
    } catch (err) {
      setErrors({ submit: 'Произошла ошибка. Попробуйте позже.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submittedToken) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 text-center light:bg-white light:border-gray-200 light:shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-semibold light:text-gray-900">Обращение принято</h1>
          <p className="mt-4 text-sm sm:text-base text-white/70 light:text-gray-600">
            Ваше обращение зарегистрировано. Сохраните код для проверки статуса:
          </p>
          <code className="mt-6 block rounded-xl bg-oss-dark border border-white/20 p-4 text-sm sm:text-lg font-mono break-all light:bg-gray-100 light:border-gray-300 light:text-gray-900">
            {submittedToken}
          </code>
          <p className="mt-4 text-xs sm:text-sm text-white/60 light:text-gray-500">
            Вы можете проверить статус на странице{' '}
            <a href="/appeal/status" className="underline text-oss-red hover:text-oss-red/80">
              проверки статуса
            </a>
          </p>
        </div>
      </main>
    );
  }

  const selectedDirectionObj = DIRECTIONS.find((d) => d.slug === selectedDirection);

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      <h1 className="text-2xl sm:text-3xl font-semibold light:text-gray-900">Подать обращение</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 light:text-gray-600">
        Опишите проблему — мы направим её в нужный комитет.
      </p>

      <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
        {presetDirection && selectedDirectionObj && (
          <div className="rounded-xl border border-white/20 bg-white/5 p-4 light:bg-white light:border-gray-200 light:shadow-sm">
            <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Направление</div>
            <div className="mt-1 font-medium text-sm sm:text-base light:text-gray-900">{selectedDirectionObj.title}</div>
          </div>
        )}

        {!presetDirection && (
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2 light:text-gray-700">Направление (опционально)</label>
            <select
              className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-sm sm:text-base light:bg-white light:border-gray-300 light:text-gray-900"
              value={selectedDirection}
              onChange={(e) => setSelectedDirection(e.target.value)}
            >
              <option value="">Не знаю / Другое</option>
              {DIRECTIONS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs sm:text-sm font-medium mb-2 light:text-gray-700">
            Краткая тема <span className="text-red-400">*</span>
          </label>
          <input
            className={`w-full rounded-xl bg-white/10 p-3 border text-sm sm:text-base ${
              errors.title ? 'border-red-500' : 'border-white/20'
            } light:bg-white light:border-gray-300 light:text-gray-900`}
            placeholder="Например: Не пришла стипендия"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
          />
          {errors.title && <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium mb-2 light:text-gray-700">
            Описание ситуации <span className="text-red-400">*</span>
          </label>
          <textarea
            className={`w-full rounded-xl bg-white/10 p-3 h-32 border text-sm sm:text-base resize-y ${
              errors.description ? 'border-red-500' : 'border-white/20'
            } light:bg-white light:border-gray-300 light:text-gray-900`}
            placeholder="Опишите подробно вашу ситуацию, что произошло, когда, какие документы есть..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
          />
          {errors.description && <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.description}</p>}
          <p className="mt-1 text-xs text-white/50 light:text-gray-500">Минимум 20 символов</p>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium mb-2 light:text-gray-700">
            Контакт для связи <span className="text-red-400">*</span>
          </label>
          <input
            className={`w-full rounded-xl bg-white/10 p-3 border text-sm sm:text-base ${
              errors.contact ? 'border-red-500' : 'border-white/20'
            } light:bg-white light:border-gray-300 light:text-gray-900`}
            placeholder="email@example.com или @telegram_username"
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              if (errors.contact) setErrors({ ...errors, contact: '' });
            }}
          />
          {errors.contact && <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.contact}</p>}
          <p className="mt-1 text-xs text-white/50 light:text-gray-500">Email или Telegram (@username)</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-5 h-5 rounded border-white/20 bg-white/10 light:border-gray-300 light:bg-white"
          />
          <label htmlFor="anonymous" className="text-xs sm:text-sm text-white/80 light:text-gray-700">
            Подать анонимно
          </label>
        </div>
        {isAnonymous && (
          <p className="text-xs text-white/60 -mt-3 light:text-gray-500">
            Примечание: анонимные обращения сложнее обрабатывать, так как мы не сможем уточнить детали напрямую.
          </p>
        )}

        {errors.submit && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs sm:text-sm text-red-400 light:bg-red-50 light:border-red-200 light:text-red-700">
            {errors.submit}
          </div>
        )}

        <button
          onClick={submit}
          disabled={isSubmitting}
          className="w-full rounded-xl bg-oss-red py-3 font-semibold hover:bg-oss-red/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить обращение'}
        </button>
      </div>
    </main>
  );
}

export default function AppealPage() {
  return (
    <Suspense fallback={
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center text-white/50">Загрузка...</div>
      </main>
    }>
      <AppealPageContent />
    </Suspense>
  );
}
