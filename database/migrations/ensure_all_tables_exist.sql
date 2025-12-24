-- ===============================
-- Миграция: Создание всех необходимых таблиц, если их нет
-- ===============================
-- 
-- Этот скрипт создает все основные таблицы, если они еще не существуют
-- Выполните его ПЕРЕД другими миграциями, если schema.sql не был выполнен
--

-- Directions
CREATE TABLE IF NOT EXISTS directions (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    title text not null,
    description text,
    color_key text not null,
    is_active boolean default true,
    created_at timestamptz default now()
);

-- Appeals
CREATE TABLE IF NOT EXISTS appeals (
    id uuid primary key default gen_random_uuid(),
    direction_id uuid references directions(id),
    category text,
    title text not null,
    description text not null,
    institute text,
    is_anonymous boolean default false,
    contact_type text check (contact_type in ('email','telegram')),
    contact_value text,
    status text not null default 'new'
        check (status in ('new','in_progress','waiting','closed')),
    public_token uuid default gen_random_uuid(),
    deadline date,
    assigned_to uuid references auth.users(id),
    priority text default 'normal' check (priority in ('low','normal','high','urgent')),
    tags text[],
    created_at timestamptz default now(),
    first_response_at timestamptz,
    closed_at timestamptz
);

-- Appeal Attachments
CREATE TABLE IF NOT EXISTS appeal_attachments (
    id uuid primary key default gen_random_uuid(),
    appeal_id uuid references appeals(id) on delete cascade,
    file_name text not null,
    file_url text not null,
    file_size integer,
    mime_type text,
    uploaded_at timestamptz default now()
);

-- Appeal Comments
CREATE TABLE IF NOT EXISTS appeal_comments (
    id uuid primary key default gen_random_uuid(),
    appeal_id uuid references appeals(id) on delete cascade,
    author_id uuid,
    message text not null,
    is_internal boolean default true,
    created_at timestamptz default now()
);

-- Content
CREATE TABLE IF NOT EXISTS content (
    id uuid primary key default gen_random_uuid(),
    type text not null check (type in ('news','guide','faq')),
    title text not null,
    slug text unique not null,
    body text not null,
    direction_id uuid references directions(id),
    status text not null default 'draft'
        check (status in ('draft','published','archived')),
    published_at timestamptz,
    updated_at timestamptz default now()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    file_url text not null,
    direction_id uuid references directions(id),
    created_at timestamptz default now()
);

-- Student Organizations
CREATE TABLE IF NOT EXISTS student_organizations (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    logo_url text,
    website_url text,
    telegram_url text,
    vk_url text,
    email text,
    contact_person text,
    is_active boolean default true,
    display_order integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- User Roles
CREATE TABLE IF NOT EXISTS user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role text not null check (role in ('board','lead','member','staff')),
    direction_id uuid references directions(id),
    created_at timestamptz default now(),
    unique(user_id, role, direction_id)
);

-- Комментарий
COMMENT ON TABLE appeals IS 'Обращения студентов';
COMMENT ON TABLE appeal_attachments IS 'Вложения к обращениям';
COMMENT ON TABLE content IS 'Контент (новости, гайды, FAQ)';

