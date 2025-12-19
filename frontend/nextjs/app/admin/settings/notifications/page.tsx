'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { getCurrentUser } from '../../../../lib/auth';
import { useToast } from '../../../../components/ToastProvider';

interface NotificationSettings {
  id?: string;
  email_enabled: boolean;
  email_appeal_status: boolean;
  email_appeal_assigned: boolean;
  email_appeal_comment: boolean;
  email_daily_summary: boolean;
  push_enabled: boolean;
  push_appeal_status: boolean;
  push_appeal_assigned: boolean;
  push_appeal_comment: boolean;
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
    email_daily_summary: false,
    push_enabled: false,
    push_appeal_status: true,
    push_appeal_assigned: true,
    push_appeal_comment: true,
  });
  const [pushSupported, setPushSupported] = useState(false);
