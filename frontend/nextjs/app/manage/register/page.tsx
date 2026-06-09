'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminRegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-oss-dark px-6 py-12">
      <div className="max-w-md w-full">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-semibold mb-2">Саморегистрация отключена</h1>
          <p className="text-white/70 mb-8">
            Внутренние аккаунты ОСС теперь создаются только через Postgres bootstrap или администраторский импорт.
          </p>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link
              href="/manage/login"
              className="text-sm text-white/70 hover:text-white transition"
            >
              Вернуться ко входу
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

