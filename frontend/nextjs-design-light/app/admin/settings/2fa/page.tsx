'use client';

import React from 'react';
import Link from 'next/link';

export default function TwoFactorAuthPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Двухфакторная аутентификация (2FA)</h1>
      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
        <h2 className="text-xl font-semibold mb-3 text-yellow-300">Функция временно отключена</h2>
        <p className="text-white/80">
          Во время миграции на Auth.js и Postgres двухфакторная аутентификация снята из релиза, чтобы не оставлять полу-живой поток входа.
        </p>
        <p className="mt-3 text-white/60">
          2FA вернется отдельным релизом уже поверх нового auth-контура.
        </p>
        <div className="mt-6">
          <Link
            href="/manage/profile"
            className="inline-flex rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
          >
            Вернуться в профиль
          </Link>
        </div>
      </div>
    </main>
  );
}

