'use client';

import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, safeSupabaseQuery } from '../lib/supabaseClient';

interface StudentOrganization {
  id: string;
  title: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  telegram_url?: string;
  vk_url?: string;
  email?: string;
  contact_person?: string;
}

export default function StudentOrganizations() {
  const [organizations, setOrganizations] = useState<StudentOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrganizations() {
      if (!isSupabaseConfigured()) {
        setError('Supabase не настроен');
        setLoading(false);
        return;
      }

      try {
        const { data, error: queryError } = await safeSupabaseQuery(
          async () => {
            const result = await supabase
              .from('student_organizations')
              .select('*')
              .eq('is_active', true)
              .order('display_order', { ascending: true })
              .order('title', { ascending: true })
              .limit(6);
            return result;
          },
          'Ошибка загрузки студенческих объединений'
        );

        if (queryError) {
          setError(queryError);
        } else if (data) {
          setOrganizations(data);
        }
      } catch (err: any) {
        console.error('Ошибка загрузки объединений:', err);
        setError(`Ошибка: ${err.message || 'Неизвестная ошибка'}`);
      } finally {
        setLoading(false);
      }
    }

    loadOrganizations();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="text-center text-white/50">Загрузка объединений...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm text-yellow-400">
        {error}
      </div>
    );
  }

  if (organizations.length === 0) {
    return null;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-3">Студенческие объединения</h2>
        <p className="text-sm sm:text-base text-white/70 max-w-2xl">
          Организации и сообщества студентов ДВФУ, которые помогают развивать студенческую жизнь и реализовывать инициативы.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 hover:bg-white/10 transition"
          >
            {org.logo_url && (
              <div className="mb-4 flex justify-center">
                <img
                  src={org.logo_url}
                  alt={org.title}
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </div>
            )}
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{org.title}</h3>
            {org.description && (
              <p className="text-sm sm:text-base text-white/70 mb-4 line-clamp-3">
                {org.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
              {org.telegram_url && (
                <a
                  href={org.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-oss-red hover:underline"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Telegram
                </a>
              )}
              {org.vk_url && (
                <a
                  href={org.vk_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-oss-red hover:underline"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.696-1.73-2.45-.216-2.45-.216s-.108.108-.108.324v1.619c0 .54-.216.864-1.08.864-1.56 0-4.32-1.32-6.108-3.78C3.84 11.4 2.4 7.56 2.4 7.56s-.108-.216 0-.324c.108-.108.324-.108.324-.108h1.728c.54 0 .756.108.972.54.54 1.08 1.836 3.564 2.376 4.32.324.54.54.756.756.756.108 0 .216-.108.216-.54v-3.78c0-.972-.108-1.08-.108-1.404 0-.216.108-.324.324-.324h2.7c.54 0 .756.324.756.756v4.32c0 .324.108.54.216.54.108 0 .216-.108.432-.54.54-1.08 1.836-3.564 2.376-4.32.216-.324.432-.54.972-.54h2.7c.54 0 .756.324.648.864-.108.54-1.08 1.728-2.268 3.024-1.836 1.836-2.376 2.052-.54 3.348 1.08.756 1.836 1.404 1.836 2.052 0 .324-.108.54-.54.54z"/>
                  </svg>
                  ВКонтакте
                </a>
              )}
              {org.website_url && (
                <a
                  href={org.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-oss-red hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Сайт
                </a>
              )}
              {org.email && (
                <a
                  href={`mailto:${org.email}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-oss-red hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              )}
            </div>
            {org.contact_person && (
              <p className="mt-3 text-xs sm:text-sm text-white/60">
                Контакт: {org.contact_person}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

