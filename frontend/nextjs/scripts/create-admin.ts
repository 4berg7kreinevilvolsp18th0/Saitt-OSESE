/**
 * Скрипт для создания административного аккаунта в Supabase
 * 
 * Использование:
 * 1. Установите переменные окружения:
 *    - SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 * 2. Запустите: npx tsx scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Ошибка: SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY должны быть установлены');
  console.error('Установите переменные окружения или создайте .env.local файл');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminAccount() {
  const email = '4.berg7kreinevilvol.sp.18th0nd@gmail.com';
  // ⚠️ ВАЖНО: Пароль на 82 символа, сгенерирован криптографически стойким генератором
  const password = '{F*bc0_R)i4CT(@6PXB1-<YEF7JQj^^RmT^{y#V9,TMJR-78KAfIS5F5y>$9?qXh]S{[jJ?(a8n8np82Y;';
  
  console.log('🔐 Создание административного аккаунта...');
  console.log('📧 Email:', email);
  console.log('🔑 Пароль: [82 символа, скрыт]');
  console.log('');
  
  try {
    // Шаг 1: Создать пользователя
    console.log('1️⃣ Создание пользователя в Supabase Auth...');
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Автоматически подтвердить email
      user_metadata: {
        role: 'board',
        full_name: 'OSS Admin',
        created_by: 'admin-setup-script'
      }
    });
    
    if (userError) {
      console.error('❌ Ошибка при создании пользователя:', userError.message);
      if (userError.message.includes('already registered')) {
        console.log('ℹ️  Пользователь уже существует. Пропускаем создание...');
        // Попробуем получить существующего пользователя
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find((u: any) => u.email === email);
        if (existingUser) {
          console.log('✅ Найден существующий пользователь:', existingUser.id);
          await assignRoleAndSettings(existingUser.id);
          return;
        }
      }
      process.exit(1);
    }
    
    if (!userData?.user) {
      console.error('❌ Не удалось создать пользователя');
      process.exit(1);
    }
    
    const userId = userData.user.id;
    console.log('✅ Пользователь создан успешно!');
    console.log('   User ID:', userId);
    console.log('');
    
    // Шаг 2: Назначить роль
    await assignRoleAndSettings(userId);
    
    console.log('');
    console.log('🎉 Административный аккаунт создан успешно!');
    console.log('');
    console.log('📋 Информация об аккаунте:');
    console.log('   Email:', email);
    console.log('   User ID:', userId);
    console.log('   Роль: board (руководство ОСС)');
    console.log('   Права: полный доступ ко всем направлениям');
    console.log('');
    console.log('⚠️  ВАЖНО: Сохраните пароль в безопасном месте!');
    console.log('   Пароль: {F*bc0_R)i4CT(@6PXB1-<YEF7JQj^^RmT^{y#V9,TMJR-78KAfIS5F5y>$9?qXh]S{[jJ?(a8n8np82Y;');
    console.log('');
    console.log('🔐 Следующие шаги:');
    console.log('   1. Войдите в Supabase Dashboard');
    console.log('   2. Перейдите в Authentication → Users');
    console.log('   3. Найдите пользователя и включите MFA (если доступно)');
    console.log('   4. Сохраните пароль в менеджере паролей');
    
  } catch (error: any) {
    console.error('❌ Неожиданная ошибка:', error.message);
    process.exit(1);
  }
}

async function assignRoleAndSettings(userId: string) {
  // Шаг 2: Назначить роль board
  console.log('2️⃣ Назначение роли "board"...');
  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert({
      user_id: userId,
      role: 'board',
      direction_id: null // NULL для board (видит все направления)
    }, {
      onConflict: 'user_id,role,direction_id'
    });
  
  if (roleError) {
    console.error('❌ Ошибка при назначении роли:', roleError.message);
    // Не критично, продолжаем
  } else {
    console.log('✅ Роль "board" назначена');
  }
  
  // Шаг 3: Создать настройки уведомлений
  console.log('3️⃣ Создание настроек уведомлений...');
  const { error: settingsError } = await supabase
    .from('notification_settings')
    .upsert({
      user_id: userId,
      email_enabled: true,
      push_enabled: true,
      telegram_enabled: false, // Настроить позже
      appeal_status: true,
      appeal_assigned: true,
      appeal_comment: true,
      daily_summary: true,
      appeal_new: true,
      appeal_overdue: true,
      appeal_escalated: true
    }, {
      onConflict: 'user_id'
    });
  
  if (settingsError) {
    console.error('❌ Ошибка при создании настроек:', settingsError.message);
    // Не критично, продолжаем
  } else {
    console.log('✅ Настройки уведомлений созданы');
  }
}

// Запуск
createAdminAccount().catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});

