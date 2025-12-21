'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, getUserRoles, signOut, type UserRoleWithDirection } from '../../lib/auth';

export default function ManagePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<UserRoleWithDirection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { user: currentUser } = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUser(currentUser);
      const userRoles = await getUserRoles();

      if (userRoles.length === 0) {
        router.push('/login');
        return;
      }

      setRoles(userRoles);
      setLoading(false);
    }

