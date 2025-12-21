
      // Логирование регистрации
      await logRegistration(formData.email, formData.role);

      // Перенаправление через 3 секунды
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Неожиданная ошибка при регистрации');
      setLoading(false);
    }
  }

  async function logRegistration(email: string, role: string) {
    try {
      await fetch('/api/security/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'registration',
          email: email.substring(0, 3) + '***',
          role,
        }),
      });
    } catch (err) {
      console.error('Log error:', err);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-oss-dark px-6 py-12">
        <div className="max-w-md w-full">
          <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-2xl font-semibold mb-4">Регистрация успешна!</h1>
            <p className="text-white/70 mb-6">
              Ваш аккаунт создан. После подтверждения администратором вы сможете войти в систему.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 rounded-xl bg-oss-red hover:bg-oss-red/90 text-white font-medium transition"
            >
              Перейти к входу
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-oss-dark px-6 py-12">
      <div className="max-w-md w-full">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2">Регистрация</h1>
            <p className="text-white/70">
              Для членов ОСС ДВФУ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ФИО</label>
              <input
                type="text"
                required
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition"
                placeholder="Иванов Иван Иванович"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition"
                placeholder="Минимум 8 символов"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div className="text-xs text-white/50 mt-1">
                Минимум 8 символов, рекомендуется использовать буквы, цифры и специальные символы
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Подтвердите пароль</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-oss-red transition"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Роль</label>
              <select
                required
                className="w-full rounded-xl bg-white/10 p-3 border border-white/20 text-white focus:outline-none focus:border-oss-red transition"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'member' | 'lead' })}
              >
                <option value="member">Член ОСС</option>
                <option value="lead">Руководитель направления</option>
              </select>
            </div>

            {formData.role === 'lead' && (
              <div>
                <label className="block text-sm font-medium mb-2">Направление</label>

          <div className="mt-4 text-xs text-white/40 text-center">
            <p>Регистрация требует подтверждения администратором.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

