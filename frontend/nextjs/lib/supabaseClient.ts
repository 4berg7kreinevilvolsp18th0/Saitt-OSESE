import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Проверка наличия переменных окружения
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase не настроен! Переменные окружения NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY не найдены.\n' +
    'Пожалуйста, настройте переменные окружения в Vercel или создайте файл .env.local'
  );
}

// Создаем клиент Supabase (даже если переменные пустые, чтобы избежать ошибок)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Проверка подключения
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseAnonKey !== 'placeholder-key');
};
