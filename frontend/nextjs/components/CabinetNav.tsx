'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { type CabinetType, getAvailableSections } from '../lib/cabinet';

interface CabinetNavProps {
  cabinetType: CabinetType;
  userEmail?: string;
  userRoles?: Array<{ role: string; directionId: string | null }>;
}

const roleLabels: Record<string, string> = {
  member: 'Член ОСС',
  lead: 'Руководитель направления',
  board: 'Руководство ОСС',
  staff: 'Аппарат',
};

export default function CabinetNav({ cabinetType, userEmail, userRoles }: CabinetNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const sections = getAvailableSections(cabinetType);

  async function handleSignOut() {
    await signOut();
    router.push('/manage/login');
  }

  if (!cabinetType) return null;

  return (
    <nav className="border-b border-white/10 bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href={`/cabinet/${cabinetType}`} className="text-lg font-semibold">
              Личный кабинет
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {sections.map((section) => {
                const isActive = pathname === section.href || pathname?.startsWith(section.href + '/');
                return (
                  <Link
                    key={section.href}
                    href={section.href}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {section.title}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userEmail && (
              <div className="hidden sm:block text-sm text-white/70">
                {userEmail}
              </div>
            )}
            {userRoles && userRoles.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                {userRoles.map((r, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded text-xs bg-white/10 text-white/80"
                  >
                    {roleLabels[r.role] || r.role}
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-lg border border-white/20 text-sm text-white/80 hover:text-white hover:border-white/40 transition"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-white/10">
        <div className="px-4 py-2 space-y-1">
          {sections.map((section) => {
            const isActive = pathname === section.href || pathname?.startsWith(section.href + '/');
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`block px-3 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {section.title}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

