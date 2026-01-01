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
