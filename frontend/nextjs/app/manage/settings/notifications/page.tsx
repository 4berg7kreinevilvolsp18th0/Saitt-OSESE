'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { getCurrentUser } from '../../../../lib/auth';
import { useToast } from '../../../../components/ToastProvider';

interface NotificationSettings {
  id?: string;
  // Email
  email_enabled: boolean;
  email_appeal_status: boolean;
  email_appeal_assigned: boolean;
  email_appeal_comment: boolean;
  email_appeal_new: boolean;
  email_appeal_overdue: boolean;
  email_appeal_escalated: boolean;
  email_daily_summary: boolean;
  // Push
  push_enabled: boolean;
  push_appeal_status: boolean;
  push_appeal_assigned: boolean;
  push_appeal_comment: boolean;
  push_appeal_new: boolean;
  push_appeal_overdue: boolean;
  push_appeal_escalated: boolean;
  // Telegram
  telegram_enabled: boolean;
  telegram_chat_id?: string | null;
  telegram_username?: string | null;
  telegram_appeal_status: boolean;
  telegram_appeal_assigned: boolean;
  telegram_appeal_comment: boolean;
  telegram_appeal_new: boolean;
  telegram_appeal_overdue: boolean;
  telegram_appeal_escalated: boolean;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email_enabled: true,
    email_appeal_status: true,
    email_appeal_assigned: true,
    email_appeal_comment: true,
    email_appeal_new: true,
    email_appeal_overdue: true,
    email_appeal_escalated: true,
    email_daily_summary: false,
    push_enabled: false,
    push_appeal_status: true,
    push_appeal_assigned: true,
    push_appeal_comment: true,
    push_appeal_new: true,
    push_appeal_overdue: true,
    push_appeal_escalated: true,
    telegram_enabled: false,
    telegram_chat_id: null,
    telegram_username: null,
    telegram_appeal_status: true,
    telegram_appeal_assigned: true,
    telegram_appeal_comment: true,
    telegram_appeal_new: true,
    telegram_appeal_overdue: true,
    telegram_appeal_escalated: true,
  });
  const [pushSupported, setPushSupported] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [telegramConnecting, setTelegramConnecting] = useState(false);

  useEffect(() => {
    checkAuth();
    checkPushSupport();
  }, []);

  async function checkAuth() {
    const { user } = await getCurrentUser();
    if (!user) {
      router.push('/admin/login');
      return;
    }
    loadSettings(user.id);
  }

  async function checkPushSupport() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setPushSupported(true);
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setPushSubscribed(!!subscription);
