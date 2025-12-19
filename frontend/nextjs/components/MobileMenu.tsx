'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLocale } from './LocaleProvider';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLocale();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Кнопка гамбургер */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition"
        aria-label="Меню"
        aria-expanded={isOpen}
      >
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Мобильное меню */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMenu}
          />
          {/* Меню */}
          <nav className="fixed top-16 left-0 right-0 bg-oss-dark border-b border-white/10 z-50 md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto light:bg-white light:border-gray-200">
            <div className="px-6 py-4 space-y-1">
              <Link
                href="/directions"
                onClick={closeMenu}
                className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-700 light:hover:bg-gray-100"
              >
                {t('navigation.directions')}
              </Link>
              <Link
                href="/appeal"
                onClick={closeMenu}
                className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-700 light:hover:bg-gray-100"
              >
                {t('navigation.appeal')}
              </Link>
              <Link
                href="/statistics"
                onClick={closeMenu}
                className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-700 light:hover:bg-gray-100"
              >
                {t('navigation.statistics')}
              </Link>
              <Link
                href="/content"
                onClick={closeMenu}
                className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-700 light:hover:bg-gray-100"
              >
                {t('navigation.content')}
              </Link>
              <Link
                href="/documents"
                onClick={closeMenu}
                className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-700 light:hover:bg-gray-100"
              >
                {t('navigation.documents')}
              </Link>
              <Link
                href="/contacts"
                onClick={closeMenu}
                className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-700 light:hover:bg-gray-100"
              >
                {t('navigation.contacts')}
              </Link>
              <div className="pt-2 border-t border-white/10 light:border-gray-200">
                <div className="px-4 py-3 space-y-3">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}

