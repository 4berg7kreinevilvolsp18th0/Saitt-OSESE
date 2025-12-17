'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '../../../lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Ошибка входа');
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-oss-dark px-6">
      <div className="max-w-md w-full">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-semibold mb-2">Вход в админ-панель</h1>
          <p className="text-white/70 mb-8">
            Доступ только для членов ОСС с соответствующими правами.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <input
                type="password"
                required
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-oss-red py-3 font-semibold hover:bg-oss-red/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/50">
            <p>Для получения доступа обратитесь к руководству ОСС.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

