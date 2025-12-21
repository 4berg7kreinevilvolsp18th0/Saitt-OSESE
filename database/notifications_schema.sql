-- ===============================
-- Notifications Settings Schema
-- ===============================

-- User notification preferences
create table if not exists notification_settings (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    -- Email notifications
    email_enabled boolean default true,
    email_appeal_status boolean default true, -- Уведомления об изменении статуса обращений
    email_appeal_assigned boolean default true, -- Уведомления о назначении обращений
    email_appeal_comment boolean default true, -- Уведомления о комментариях
    email_appeal_new boolean default true, -- Уведомления о новых обращениях
    email_appeal_overdue boolean default true, -- Уведомления о просроченных обращениях
    email_appeal_escalated boolean default true, -- Уведомления об эскалации
    email_daily_summary boolean default false, -- Ежедневная сводка
    -- Push notifications
    push_enabled boolean default false,
    push_subscription jsonb, -- Web Push subscription object
    push_appeal_status boolean default true,
    push_appeal_assigned boolean default true,
    push_appeal_comment boolean default true,
    push_appeal_new boolean default true,
    push_appeal_overdue boolean default true,
    push_appeal_escalated boolean default true,
    -- Telegram notifications (для админов)
    telegram_enabled boolean default false,
    telegram_chat_id text, -- Telegram chat_id пользователя (получается через бота)
    telegram_username text, -- Telegram username для удобства
    telegram_appeal_status boolean default true,
    telegram_appeal_assigned boolean default true,
    telegram_appeal_comment boolean default true,
    telegram_appeal_new boolean default true,
    telegram_appeal_overdue boolean default true,
    telegram_appeal_escalated boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id)
);

-- Notification log (для истории отправленных уведомлений)
create table if not exists notification_log (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    appeal_id uuid references appeals(id) on delete cascade,
    type text not null check (type in ('email', 'push', 'telegram')),
    event_type text not null check (event_type in ('appeal_status', 'appeal_assigned', 'appeal_comment', 'appeal_new', 'appeal_overdue', 'appeal_escalated', 'daily_summary')),
    title text not null,
    message text,
    sent_at timestamptz default now(),
    success boolean default true,
    error_message text
);

-- Indexes
create index if not exists idx_notification_settings_user on notification_settings(user_id);
create index if not exists idx_notification_log_user on notification_log(user_id);
create index if not exists idx_notification_log_appeal on notification_log(appeal_id);
create index if not exists idx_notification_log_sent_at on notification_log(sent_at desc);

-- RLS Policies
alter table notification_settings enable row level security;
alter table notification_log enable row level security;

-- Users can only see and modify their own notification settings
drop policy if exists "notification_settings_own" on notification_settings;
create policy "notification_settings_own" on notification_settings
    for all using (auth.uid() = user_id);

-- Users can only see their own notification log
drop policy if exists "notification_log_own" on notification_log;
create policy "notification_log_own" on notification_log
    for select using (auth.uid() = user_id);

-- Members can insert notification logs (for system notifications)
drop policy if exists "notification_log_insert" on notification_log;
create policy "notification_log_insert" on notification_log
    for insert with check (
        auth.uid() = user_id or
        public.has_role('board') or
        public.has_role('staff')
    );

