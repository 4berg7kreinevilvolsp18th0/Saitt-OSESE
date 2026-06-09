'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserCabinetInfo, hasCabinetAccess, type CabinetType } from '../lib/cabinet';
import CabinetNav from './CabinetNav';

interface CabinetGuardProps {
  children: React.ReactNode;
  requiredRole?: 'member' | 'lead' | 'board' | 'staff' | Array<'member' | 'lead' | 'board' | 'staff'>;
}

export default function CabinetGuard({ children, requiredRole }: CabinetGuardProps) {
  const router = useRouter();
  const [cabinetInfo, setCabinetInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      const info = await getUserCabinetInfo();
      
      if (!info) {
        router.push('/manage/login');
        return;
      }

      // Проверяем доступ
      if (requiredRole) {
        const hasAccess = hasCabinetAccess(info.cabinetType, requiredRole);
        if (!hasAccess) {
          // Редиректим на главную страницу кабинета
          router.push(`/cabinet/${info.cabinetType}`);
          return;
        }
      }

      setCabinetInfo(info);
      setLoading(false);
    }

    checkAccess();
  }, [router, requiredRole]);

  if (loading) {
    return (
      <main className="min-h-screen bg-oss-dark">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-white/50">Загрузка...</div>
        </div>
      </main>
    );
  }

  if (!cabinetInfo) return null;

  return (
    <>
      <CabinetNav
        cabinetType={cabinetInfo.cabinetType}
        userEmail={cabinetInfo.user?.email}
        userRoles={cabinetInfo.roles}
      />
      {children}
    </>
  );
}

