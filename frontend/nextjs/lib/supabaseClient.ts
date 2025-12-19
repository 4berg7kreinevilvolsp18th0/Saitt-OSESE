import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// КРИТИЧЕСКАЯ ПРОВЕРКА: Убеждаемся, что используется ANON ключ, а не SERVICE_ROLE
if (supabaseAnonKey && (
  supabaseAnonKey.includes('service_role') || 
  supabaseAnonKey.length > 200 || // service_role ключи обычно длиннее
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY // если случайно установлен service_role
)) {
  const errorMessage = 
    '🚨 КРИТИЧЕСКАЯ ОШИБКА БЕЗОПАСНОСТИ!\n\n' +
    '❌ ВЫ ИСПОЛЬЗУЕТЕ SERVICE_ROLE КЛЮЧ ВМЕСТО ANON КЛЮЧА!\n\n' +
    'Проблема: В переменной окружения NEXT_PUBLIC_SUPABASE_ANON_KEY установлен service_role ключ.\n\n' +
    '✅ РЕШЕНИЕ:\n' +
    '1. Зайдите в Supabase Dashboard → Settings → API\n' +
    '2. Найдите секцию "Project API keys"\n' +
    '3. Скопируйте ключ из колонки "anon public" (НЕ "service_role"!)\n' +
    '4. В Vercel: Settings → Environment Variables\n' +
    '5. Найдите NEXT_PUBLIC_SUPABASE_ANON_KEY и замените на правильный anon ключ\n' +
    '6. Перезапустите деплой (Redeploy)\n\n' +
    '⚠️ SERVICE_ROLE ключ НИКОГДА не должен использоваться в браузере!\n' +
    'Он обходит все ограничения безопасности и дает полный доступ к базе данных!';
  
  console.error(errorMessage);
  
  // В браузере показываем понятное сообщение
  if (typeof window !== 'undefined') {
    // Создаем видимое сообщение об ошибке
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #DC2626;
      color: white;
      padding: 20px;
      z-index: 99999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    errorDiv.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto;">
        <strong style="font-size: 16px;">🚨 КРИТИЧЕСКАЯ ОШИБКА БЕЗОПАСНОСТИ</strong>
        <p style="margin: 10px 0 0 0;">
          Вы используете SERVICE_ROLE ключ вместо ANON ключа. 
          <a href="/docs/SECURITY_KEY_ERROR_FIX.md" style="color: #FCD34D; text-decoration: underline; margin-left: 10px;">
            Инструкция по исправлению →
          </a>
        </p>
      </div>
    `;
    document.body.prepend(errorDiv);
  }
  
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
    if (supabaseAnonKey.length > 200 && !supabaseAnonKey.includes('service_role')) {
      console.warn(
        '⚠️ ВНИМАНИЕ: Ключ выглядит слишком длинным для anon key.\n' +
        'Убедитесь, что используете anon public ключ, а не service_role!\n' +
        'Проверьте: Supabase Dashboard → Settings → API → anon public'
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
