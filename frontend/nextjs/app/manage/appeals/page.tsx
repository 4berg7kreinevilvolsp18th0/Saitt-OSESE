// Редирект на старую страницу (временно для совместимости)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageAppealsRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Временно редиректим на старую страницу
    // Позже можно скопировать код из /admin/appeals
    router.replace('/admin/appeals');
  }, [router]);

  return <div>Перенаправление...</div>;
}

