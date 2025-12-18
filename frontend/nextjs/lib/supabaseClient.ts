import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// КРИТИЧЕСКАЯ ПРОВЕРКА: Убеждаемся, что используется ANON ключ, а не SERVICE_ROLE
if (supabaseAnonKey && (
  supabaseAnonKey.includes('service_role') || 
  supabaseAnonKey.length > 200 || // service_role ключи обычно длиннее
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY // если случайно установлен service_role
)) {
  console.error(
    '🚨 КРИТИЧЕСКАЯ ОШИБКА БЕЗОПАСНОСТИ!\n' +
    'Обнаружен SERVICE_ROLE ключ вместо ANON ключа!\n' +
    'SERVICE_ROLE ключ НИКОГДА не должен использоваться в браузере!\n' +
    'Используйте только NEXT_PUBLIC_SUPABASE_ANON_KEY из Supabase Dashboard → Settings → API → anon public\n' +
    'Удалите NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY из переменных окружения!'
  );
  throw new Error('Forbidden use of secret API key in browser');
}

// Проверка наличия переменных окружения
if (typeof window !== 'undefined') {
  // Только в браузере
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      '❌ Supabase не настроен!\n' +
      'Переменные окружения NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY не найдены.\n' +
      'Пожалуйста, настройте переменные окружения в Vercel или создайте файл .env.local\n' +
      'Инструкция: docs/SUPABASE_SETUP.md'
    );
  } else {
    // Проверка формата URL
    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL выглядит неправильно:', supabaseUrl);
    }
    
    // Проверка, что ключ выглядит как anon key (обычно начинается с eyJ и короче service_role)
    if (supabaseAnonKey.length > 200) {
      console.warn(
        '⚠️ ВНИМАНИЕ: Ключ выглядит слишком длинным для anon key.\n' +
        'Убедитесь, что используете anon public ключ, а не service_role!'
      );
    }
  }
}

// Создаем клиент Supabase (даже если переменные пустые, чтобы избежать ошибок)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: false, // Отключаем сохранение сессии для SSR
    },
  }
);

// Проверка подключения
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseAnonKey !== 'placeholder-key' &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co'));
};

// Функция для безопасного выполнения запросов с обработкой ошибок
export async function safeSupabaseQuery<T>(
  query: () => Promise<{ data: T | null; error: any }>,
  errorMessage = 'Ошибка при загрузке данных'
): Promise<{ data: T | null; error: string | null }> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: 'Supabase не настроен. Проверьте переменные окружения.',
      };
    }

    const result = await query();

    if (result.error) {
      console.error('Supabase error:', result.error);
      
      // Обработка специфичных ошибок
      if (result.error.code === 'PGRST116') {
        return {
          data: null,
          error: 'Таблица не найдена. Убедитесь, что schema.sql выполнен в Supabase.',
        };
      }
      
      if (result.error.code === '42P01') {
        return {
          data: null,
          error: 'Таблица не существует. Выполните database/schema.sql в Supabase SQL Editor.',
        };
      }

      if (result.error.message?.includes('404') || result.error.message?.includes('NOT_FOUND')) {
        return {
          data: null,
          error: 'Ресурс не найден (404). Проверьте настройки Supabase и переменные окружения.',
        };
      }

      return {
        data: null,
        error: result.error.message || errorMessage,
      };
    }

    return { data: result.data, error: null };
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return {
      data: null,
      error: err.message || errorMessage,
    };
  }
}
