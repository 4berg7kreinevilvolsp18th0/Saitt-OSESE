'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { getCurrentUser, getUserRoles, signOut, type UserRoleWithDirection } from '../../../lib/auth';
import { useToast } from '../../../components/ToastProvider';

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<UserRoleWithDirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Статистика
  const [stats, setStats] = useState({
    totalAppeals: 0,
    myAppeals: 0,
    assignedToMe: 0,
    closedAppeals: 0,
  });
  
  // Форма изменения пароля
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);
