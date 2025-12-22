'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../../../lib/auth';
import { supabase } from '../../../../lib/supabaseClient';
import { verify2FAToken, is2FAEnabled } from '../../../../lib/2fa';
import QRCode from 'qrcode';

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const [qrCodeURL, setQrCodeURL] = useState<string>('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [verificationToken, setVerificationToken] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { user: currentUser } = await getCurrentUser();
      if (!currentUser) {
        router.push('/admin/login');
        return;
      }
      setUser(currentUser);

      // Проверить статус 2FA
      const isEnabled = await is2FAEnabled(currentUser.id);
      setEnabled(isEnabled);
      setLoading(false);
    }
    loadUser();
  }, [router]);

  async function handleSetup() {
    setSettingUp(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to setup 2FA');
      }

      const data = await response.json();
      setQrCodeURL(data.qrCodeURL);

      // Генерация QR кода изображения
      const qrDataURL = await QRCode.toDataURL(data.qrCodeURL);
      setQrCodeDataURL(qrDataURL);
    } catch (err: any) {
      setError(err.message || 'Ошибка настройки 2FA');
    } finally {
      setSettingUp(false);
    }
  }

  async function handleVerify() {
    if (!verificationToken) {
      setError('Введите код из приложения');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: verificationToken,
          enable: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid token');
      }

      const data = await response.json();
      setBackupCodes(data.backupCodes || []);
      setEnabled(true);
      setSuccess('2FA успешно включена! Сохраните резервные коды.');
      setQrCodeURL('');
      setQrCodeDataURL('');
      setVerificationToken('');
    } catch (err: any) {
      setError(err.message || 'Ошибка верификации');
    }
  }

  async function handleDisable() {
    if (!confirm('Вы уверены, что хотите отключить 2FA? Это снизит безопасность вашего аккаунта.')) {
      return;
    }

    setError(null);
    setSuccess(null);
