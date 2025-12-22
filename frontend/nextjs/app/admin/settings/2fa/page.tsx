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
