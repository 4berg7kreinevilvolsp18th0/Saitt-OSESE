'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verify2FAToken, getUser2FASecret } from '../../../lib/2fa';

export default function TwoFactorAuthLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Получить user ID из sessionStorage
    const storedUserId = sessionStorage.getItem('2fa_user_id');
    if (!storedUserId) {
      router.push('/login');
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token || token.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }

    if (!userId) {
      setError('Ошибка сессии. Попробуйте войти снова.');
      router.push('/login');
      return;
    }

    setLoading(true);
