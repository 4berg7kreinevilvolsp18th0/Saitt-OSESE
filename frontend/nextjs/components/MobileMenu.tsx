'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale } from './LocaleProvider';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const { t } = useLocale();
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: PointerEvent) {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="md:hidden flex min-h-11 min-w-11 flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-white/10 focus-ring light:hover:bg-gray-100"
        aria-label={t('navigation.menu')}
        aria-expanded={isOpen}
        aria-controls={menuId}
      >
        <span aria-hidden="true" className={`w-6 h-0.5 bg-white light:bg-gray-900 transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span aria-hidden="true" className={`w-6 h-0.5 bg-white light:bg-gray-900 ${isOpen ? 'opacity-0' : ''}`} />
        <span aria-hidden="true" className={`w-6 h-0.5 bg-white light:bg-gray-900 transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>
      <nav
        ref={menuRef}
        id={menuId}
        hidden={!isOpen}
        aria-label={t('navigation.menu')}
        className="absolute top-full inset-x-0 z-20 bg-oss-dark border-b border-white/10 shadow-xl md:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto light:bg-white light:border-gray-200"
      >
        <div className="px-4 py-3 space-y-1">
          <Link
            href="/directions"
            onClick={closeMenu}
            className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition light:text-gray-700 light:hover:bg-gray-100"
          >
            {t('navigation.directions')}
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
        </div>
      </nav>
    </>
  );
}
