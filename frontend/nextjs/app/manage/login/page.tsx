'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        // Более понятные сообщения об ошибках
        let errorMessage = 'Ошибка входа';
        
        if (signInError.message?.includes('Invalid login credentials')) {
          errorMessage = 'Неверный email или пароль';
        } else if (signInError.message?.includes('Email not confirmed')) {
          errorMessage = 'Email не подтвержден. Проверьте почту.';
        } else if (signInError.message?.includes('Too many requests')) {
          errorMessage = 'Слишком много попыток. Попробуйте позже.';
        } else if (signInError.message) {
          errorMessage = signInError.message;
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }
