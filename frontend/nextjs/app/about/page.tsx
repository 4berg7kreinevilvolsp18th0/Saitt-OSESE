'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-oss-dark light:bg-gray-50 text-white light:text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <Link 
            href="/"
            className="text-oss-red hover:text-oss-red/80 text-sm sm:text-base font-medium flex items-center gap-2 mb-6
              light:text-oss-red light:hover:text-oss-red/90"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            На главную
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 light:text-gray-900">О проекте</h1>
          <p className="text-white/70 light:text-gray-600 text-sm sm:text-base">
            Информация о технологиях, архитектуре и используемых сервисах
          </p>
        </div>

        <div className="prose prose-invert light:prose-light max-w-none
          prose-headings:text-white light:prose-headings:text-gray-900
          prose-p:text-white/80 light:prose-p:text-gray-700
          prose-a:text-oss-red light:prose-a:text-oss-red
          prose-strong:text-white light:prose-strong:text-gray-900
          prose-code:text-oss-red light:prose-code:text-oss-red
          prose-pre:bg-oss-dark/50 light:prose-pre:bg-gray-100
          rounded-2xl border border-white/10 light:border-gray-200 bg-white/5 light:bg-white p-6 sm:p-8 md:p-10">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 light:text-gray-900">Описание</h2>
            <p className="text-white/80 light:text-gray-700 leading-relaxed">
              Официальный сайт Объединённого совета студентов Дальневосточного федерального университета (ОСС ДВФУ). 
              Единая платформа для подачи обращений, публикации новостей, гайдов и документов, а также управления 
              студенческими организациями.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 light:text-gray-900">Архитектура проекта</h2>
            
            <h3 className="text-xl font-semibold mb-3 light:text-gray-900">Frontend</h3>
            <ul className="list-disc list-inside space-y-2 text-white/80 light:text-gray-700 mb-6">
              <li><strong>Next.js 14</strong> (App Router) — React-фреймворк для серверного рендеринга</li>
              <li><strong>React 18.3</strong> — библиотека для построения пользовательского интерфейса</li>
              <li><strong>TypeScript 5.6</strong> — типизированный JavaScript</li>
              <li><strong>Tailwind CSS 3.4</strong> — utility-first CSS фреймворк</li>
              <li><strong>Supabase</strong> — клиент для работы с базой данных и аутентификацией</li>
              <li><strong>Recharts</strong> — библиотека для построения графиков</li>
              <li><strong>Keystatic</strong> — headless CMS для управления контентом</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 light:text-gray-900">Backend (опционально)</h3>
            <ul className="list-disc list-inside space-y-2 text-white/80 light:text-gray-700 mb-6">
              <li><strong>FastAPI 0.109</strong> — современный Python веб-фреймворк</li>
              <li><strong>SQLAlchemy 2.0</strong> — ORM для работы с базой данных</li>
              <li><strong>Uvicorn</strong> — ASGI сервер</li>
              <li><strong>Pydantic 2.5</strong> — валидация данных</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 light:text-gray-900">База данных</h3>
            <ul className="list-disc list-inside space-y-2 text-white/80 light:text-gray-700">
              <li><strong>Supabase (PostgreSQL)</strong> — основная база данных</li>
              <li>Row Level Security (RLS) для контроля доступа</li>
              <li>Автоматические бэкапы</li>
              <li>Реалтайм подписки</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 light:text-gray-900">Используемые сервисы</h2>
            <ul className="list-disc list-inside space-y-2 text-white/80 light:text-gray-700">
              <li><strong>Vercel</strong> — хостинг frontend приложения</li>
              <li><strong>Supabase</strong> — Backend-as-a-Service (БД, хранилище, аутентификация)</li>
              <li><strong>Upstash Redis</strong> — управляемый Redis для кэширования</li>
              <li><strong>GitHub Actions</strong> — CI/CD и автоматизация</li>
              <li><strong>GitHub Security</strong> — сканирование кода на уязвимости</li>
              <li><strong>Telegram Bot API</strong> — интеграция с Telegram каналом</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 light:text-gray-900">Безопасность</h2>
            <ul className="list-disc list-inside space-y-2 text-white/80 light:text-gray-700">
              <li><strong>Supabase Auth</strong> — встроенная аутентификация с поддержкой 2FA</li>
              <li><strong>Row Level Security (RLS)</strong> — контроль доступа на уровне строк</li>
              <li><strong>Rate Limiting</strong> — защита от DDoS и злоупотреблений</li>
              <li><strong>CodeQL</strong> — статический анализ кода</li>
              <li><strong>Secret Scanning</strong> — поиск секретов в коде</li>
              <li><strong>Dependency Review</strong> — проверка уязвимостей в зависимостях</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 light:text-gray-900">Возможности</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 light:text-gray-900">Для студентов</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-white/80 light:text-gray-700">
                  <li>Подача обращений</li>
                  <li>Отслеживание статуса</li>
                  <li>Просмотр новостей и гайдов</li>
                  <li>Поиск документов</li>
                  <li>Просмотр статистики</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 light:text-gray-900">Для членов ОСС</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-white/80 light:text-gray-700">
                  <li>Админ-панель</li>
                  <li>Управление обращениями</li>
                  <li>Управление контентом</li>
                  <li>Дашборды со статистикой</li>
                  <li>Экспорт данных</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 light:text-gray-900">Документация</h2>
            <p className="text-white/80 light:text-gray-700 mb-4">
              Подробная документация доступна в репозитории проекта:
            </p>
            <div className="bg-oss-dark/50 light:bg-gray-100 rounded-lg p-4 border border-white/10 light:border-gray-200">
              <code className="text-sm text-white/90 light:text-gray-900">
                docs/ru/PROJECT.md
              </code>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

