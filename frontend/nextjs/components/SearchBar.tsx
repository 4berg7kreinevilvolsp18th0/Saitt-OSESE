'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from './LocaleProvider';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder,
  className = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`relative flex items-center rounded-xl border transition ${
        isFocused 
          ? 'border-oss-red bg-white/10 light:border-oss-red light:bg-gray-50' 
          : 'border-white/20 bg-white/5 light:border-gray-300 light:bg-white'
      }`}>
        <svg 
          className="absolute left-3 w-5 h-5 text-white/50 light:text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || t('common.search')}
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-transparent text-white placeholder-white/50 focus:outline-none text-sm sm:text-base light:text-gray-900 light:placeholder-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-lg hover:bg-white/10 transition light:hover:bg-gray-200"
            aria-label="Очистить поиск"
          >
            <svg className="w-4 h-4 text-white/60 light:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

