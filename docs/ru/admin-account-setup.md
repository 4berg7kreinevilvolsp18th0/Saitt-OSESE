# Создание административного аккаунта в Supabase

Инструкция по созданию защищенного административного аккаунта для ОСС ДВФУ.

## 🔐 Генерация сильного пароля

### Требования к паролю:
- **Длина:** 82 символа (максимальная безопасность)
- **Символы:** буквы (верхний/нижний регистр), цифры, специальные символы
- **Случайность:** криптографически стойкий генератор

### Сгенерированный пароль:

**⚠️ ВАЖНО:** Сохраните этот пароль в безопасном месте (менеджер паролей)!

```
{F*bc0_R)i4CT(@6PXB1-<YEF7JQj^^RmT^{y#V9,TMJR-78KAfIS5F5y>$9?qXh]S{[jJ?(a8n8np82Y;
```

**Характеристики пароля:**
- Длина: 82 символа
- Содержит: заглавные/строчные буквы, цифры, специальные символы
- Криптографически стойкий (Node.js crypto.randomInt)

## 📝 Создание аккаунта в Supabase

### Вариант 1: Через Supabase Dashboard (рекомендуется)

1. **Зайдите в Supabase Dashboard:**
   - Откройте [supabase.com](https://supabase.com)
   - Войдите в ваш проект

2. **Создание пользователя:**
   - Перейдите в **Authentication** → **Users**
   - Нажмите **"Add user"** → **"Create new user"**
   - Заполните:
     - **Email:** `4.berg7kreinevilvol.sp.18th0nd@gmail.com`
     - **Password:** [вставьте сгенерированный пароль]
     - **Auto Confirm User:** ✅ (включить)
   - Нажмите **"Create user"**

3. **Назначение роли:**
   - После создания пользователя, скопируйте его `User UID`
   - Перейдите в **SQL Editor**
   - Выполните SQL:

```sql
-- Замените YOUR_USER_UUID на реальный UUID пользователя
INSERT INTO user_roles (user_id, role, direction_id)
VALUES (
  'YOUR_USER_UUID',  -- UUID из Authentication → Users
  'board',           -- Роль: board (руководство ОСС)
  NULL               -- NULL для board (видит все направления)
);

-- Создать настройки уведомлений
INSERT INTO notification_settings (user_id, email_enabled, push_enabled, telegram_enabled)
VALUES (
  'YOUR_USER_UUID',
  true,   -- Email уведомления включены
  true,   -- Push уведомления включены
  false   -- Telegram (настроить позже)
);
```

### Вариант 2: Через Supabase API (программно)

**Создать скрипт для регистрации:**

```typescript
// scripts/create-admin.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminAccount() {
  const email = '4.berg7kreinevilvol.sp.18th0nd@gmail.com';
  const password = 'YOUR_GENERATED_PASSWORD'; // Вставить сгенерированный пароль
  
  // Создать пользователя
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Автоматически подтвердить email
    user_metadata: {
      role: 'board',
      full_name: 'OSS Admin'
    }
  });
  
  if (userError) {
    console.error('Error creating user:', userError);
    return;
  }
  
  const userId = userData.user.id;
  console.log('User created:', userId);
  
  // Назначить роль
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role: 'board',
      direction_id: null
    });
  
  if (roleError) {
    console.error('Error assigning role:', roleError);
    return;
  }
  
  // Создать настройки уведомлений
  const { error: settingsError } = await supabase
    .from('notification_settings')
    .insert({
      user_id: userId,
      email_enabled: true,
      push_enabled: true,
      telegram_enabled: false
    });
  
  if (settingsError) {
    console.error('Error creating settings:', settingsError);
    return;
  }
  
  console.log('✅ Admin account created successfully!');
  console.log('Email:', email);
  console.log('User ID:', userId);
}

createAdminAccount();
```

**Запуск:**
```bash
cd frontend/nextjs

# Установить зависимости (если еще не установлены)
npm install

# Установить tsx для запуска TypeScript
npm install -D tsx

# Создать .env.local с переменными (если еще нет)
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Запустить скрипт
npx tsx scripts/create-admin.ts
```

**Или использовать готовый скрипт:**
```bash
# Скрипт уже создан в frontend/nextjs/scripts/create-admin.ts
# Просто запустите:
npx tsx scripts/create-admin.ts
```

## 🔒 Дополнительная безопасность

### 1. Включить MFA (двухфакторную аутентификацию)

После создания аккаунта:

1. Войдите в Supabase Dashboard
2. Перейдите в **Authentication** → **Users** → выберите пользователя
3. Включите **MFA** (если доступно)

### 2. Настроить сессии

**Ограничить время жизни сессий:**
```sql
-- В Supabase SQL Editor
-- Настроить через Supabase Dashboard → Authentication → Settings
```

### 3. Мониторинг доступа

**Создать триггер для логирования входов:**
```sql
-- Таблица для логирования входов
CREATE TABLE IF NOT EXISTS login_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Функция для логирования (вызывать из приложения)
CREATE OR REPLACE FUNCTION log_login(
  p_user_id UUID,
  p_ip_address INET,
  p_user_agent TEXT,
  p_success BOOLEAN
) RETURNS VOID AS $$
BEGIN
  INSERT INTO login_log (user_id, ip_address, user_agent, success)
  VALUES (p_user_id, p_ip_address, p_user_agent, p_success);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 📋 Чеклист создания аккаунта

- [ ] Сгенерирован пароль на 82 символа
- [ ] Пароль сохранен в менеджере паролей
- [ ] Создан пользователь в Supabase
- [ ] Назначена роль `board`
- [ ] Созданы настройки уведомлений
- [ ] Включен MFA (если доступно)
- [ ] Протестирован вход в систему
- [ ] Настроен мониторинг доступа

## 🚨 Безопасность пароля

### Хранение пароля:

**✅ ПРАВИЛЬНО:**
- Менеджер паролей (1Password, Bitwarden, LastPass)
- Зашифрованное хранилище
- Не передавать по незащищенным каналам

**❌ НЕПРАВИЛЬНО:**
- Хранить в текстовом файле
- Отправлять по email
- Сохранять в браузере (для админ-аккаунтов)
- Делиться в чатах

### Ротация пароля:

**Рекомендуется менять пароль:**
- Каждые 90 дней
- При подозрении на компрометацию
- После инцидентов безопасности

## 🔐 Дополнительные меры защиты

### 1. IP Whitelist (опционально)

Если есть статический IP:

```sql
-- Создать таблицу разрешенных IP
CREATE TABLE IF NOT EXISTS allowed_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Добавить ваш IP
INSERT INTO allowed_ips (user_id, ip_address, description)
VALUES (
  'YOUR_USER_UUID',
  'YOUR_IP_ADDRESS',
  'Office IP'
);
```

### 2. Уведомления о входе

**Настроить email уведомления:**
- При входе с нового устройства
- При входе с нового IP
- При неудачных попытках входа

### 3. Ограничение сессий

**Настроить в Supabase:**
- Максимальное количество активных сессий
- Время жизни токена
- Автоматический logout при неактивности

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи в Supabase Dashboard
2. Убедитесь, что пароль скопирован полностью (82 символа)
3. Проверьте, что email правильный
4. Убедитесь, что роль назначена правильно

---

**Важно:** Этот пароль должен храниться в максимальной секретности. Никогда не коммитьте его в Git и не делитесь им.

