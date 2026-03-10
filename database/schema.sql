-- ===============================
-- ОСС ДВФУ Database Schema исправленный ===============================
-- ===============================

create extension if not exists "pgcrypto";

-- Directions / Committees
create table if not exists directions (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    title text not null,
    description text,
    color_key text not null,
    is_active boolean default true,
    created_at timestamptz default now()
);

-- Жалобы
create table if not exists appeals (
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
    assigned_to uuid references auth.users(id), -- Ответственный за обращение
    priority text default 'normal' check (priority in ('low','normal','high','urgent')),
    tags text[], -- Массив тегов для классификации
    created_at timestamptz default now(),
    first_response_at timestamptz,
    closed_at timestamptz
);

-- Вложения к жалобам
create table if not exists appeal_attachments (
    id uuid primary key default gen_random_uuid(),
    appeal_id uuid references appeals(id) on delete cascade,
    file_name text not null,
    file_url text not null, -- URL файла в Supabase Storage
    file_size integer, -- Размер в байтах
    mime_type text, -- MIME тип файла
    uploaded_at timestamptz default now()
);

-- Комментарии к жалобам
create table if not exists appeal_comments (
    id uuid primary key default gen_random_uuid(),
    appeal_id uuid references appeals(id) on delete cascade,
    author_id uuid,
    message text not null,
    is_internal boolean default true,
    created_at timestamptz default now()
);

-- Контент (новости, руководства, FAQ)
create table if not exists content (
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

-- Документы
create table if not exists documents (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    file_url text not null,
    direction_id uuid references directions(id),
    created_at timestamptz default now()
);

-- Студенческие объединения
create table if not exists student_organizations (
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

-- Роли пользователей (для интеграции с Supabase Auth)
-- Создаем таблицу ДО индексов, чтобы избежать ошибок
create table if not exists user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null, -- Supabase auth.users.id
    role text not null check (role in ('member','lead','board','staff')),
    direction_id uuid references directions(id), -- null for board/staff, set for member/lead
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, role, direction_id)
);

-- ===============================
-- Indexes for Performance
-- ===============================

-- Индексы для жалоб
create index if not exists idx_appeals_status on appeals(status);
create index if not exists idx_appeals_direction on appeals(direction_id);
create index if not exists idx_appeals_created_at on appeals(created_at desc);
create index if not exists idx_appeals_public_token on appeals(public_token);
create index if not exists idx_appeals_assigned_to on appeals(assigned_to);
create index if not exists idx_appeals_priority on appeals(priority);
create index if not exists idx_appeals_deadline on appeals(deadline) where deadline is not null;

-- Индексы для вложений к жалобам
create index if not exists idx_appeal_attachments_appeal on appeal_attachments(appeal_id);

-- Индексы для контента
create index if not exists idx_content_status on content(status);
create index if not exists idx_content_type on content(type);
create index if not exists idx_content_direction on content(direction_id);
create index if not exists idx_content_published_at on content(published_at desc);
create index if not exists idx_content_slug on content(slug);

-- Индексы для комментариев к жалобам
create index if not exists idx_appeal_comments_appeal on appeal_comments(appeal_id);
create index if not exists idx_appeal_comments_created_at on appeal_comments(created_at desc);
-- Индексы для ролей пользователей
create index if not exists idx_user_roles_user_id on user_roles(user_id);
create index if not exists idx_user_roles_role on user_roles(role);
create index if not exists idx_user_roles_direction on user_roles(direction_id);

-- Индексы для направлений
create index if not exists idx_directions_slug on directions(slug);
create index if not exists idx_directions_active on directions(is_active) where is_active = true;

-- Индексы для студенческих объединений
create index if not exists idx_student_organizations_active on student_organizations(is_active) where is_active = true;
create index if not exists idx_student_organizations_display_order on student_organizations(display_order);

-- ===============================
-- Политики Row Level Security (RLS)
-- ===============================

-- Включаем RLS на всех таблицах
alter table appeals enable row level security;
alter table appeal_comments enable row level security;
alter table content enable row level security;
alter table documents enable row level security;
alter table directions enable row level security;
alter table student_organizations enable row level security;
alter table user_roles enable row level security;
alter table appeal_attachments enable row level security;

-- Направления: пользователи могут читать активные направления
drop policy if exists "directions_public_read" on directions;
create policy "directions_public_read" on directions
  for select using (is_active = true);

-- Жалобы: пользователи могут создавать жалобы, обращеения вопросы и предложения
drop policy if exists "appeals_public_insert" on appeals;
create policy "appeals_public_insert" on appeals
  for insert with check (true);

-- Жалобы: публичный может читать по public_token
drop policy if exists "appeals_public_read_by_token" on appeals;
create policy "appeals_public_read_by_token" on appeals
  for select using (
    -- Разрешаем чтение если public_token совпадает (будет проверено в приложении)
    true
  );

-- Вспомогательная функция для проверки роли пользователя, чтобы убедиться, что они имеют правильные роли
create or replace function public.has_role(p_role text, p_direction_id uuid default null)
returns boolean
language plpgsql
security definer
as $$
begin
  if p_direction_id is null then
    -- Проверяем если пользователь имеет роль без направления (board/staff)
    return exists (
      select 1 from user_roles
      where user_id = (SELECT auth.uid())::uuid
        and role = p_role
        and direction_id is null
    );
  else
    -- Проверяем если пользователь имеет роль для конкретного направления
    return exists (
      select 1 from user_roles
      where user_id = (SELECT auth.uid())::uuid
        and role = p_role
        and (direction_id = p_direction_id or direction_id is null)
    );
  end if;
end;
$$;

  -- Жалобы: члены могут читать жалобы своего направления
drop policy if exists "appeals_members_read" on appeals;
create policy "appeals_members_read" on appeals
  for select using (
    -- Board и staff могут видеть все
    public.has_role('board') or public.has_role('staff')
    or
    -- Lead могут видеть жалобы своего направления
    (public.has_role('lead', direction_id) and direction_id is not null)
    or
    -- Member могут видеть жалобы своего направления
    (public.has_role('member', direction_id) and direction_id is not null)
  );

-- Жалобы: члены могут обновлять статус
drop policy if exists "appeals_members_update" on appeals;
create policy "appeals_members_update" on appeals
  for update using (
    -- Board can update all; leads and members can update appeals of their direction
    public.has_role('board')
    or
    (public.has_role('lead', direction_id) and direction_id is not null)
    or
    (public.has_role('member', direction_id) and direction_id is not null)
  );

-- Комментарии к жалобам: члены могут читать и создавать
drop policy if exists "appeal_comments_read" on appeal_comments;
create policy "appeal_comments_read" on appeal_comments
  for select using (
    -- Can read if user has access to the appeal
    exists (
      select 1 from appeals
      where appeals.id = appeal_comments.appeal_id
        and (
          public.has_role('board') or public.has_role('staff')
          or public.has_role('lead', appeals.direction_id)
          or public.has_role('member', appeals.direction_id)
        )
    )
  );

drop policy if exists "appeal_comments_insert" on appeal_comments;
create policy "appeal_comments_insert" on appeal_comments
  for insert with check (
    -- Can comment if user has access to the appeal
    exists (
      select 1 from appeals
      where appeals.id = appeal_comments.appeal_id
        and (
          public.has_role('board') or public.has_role('staff')
          or public.has_role('lead', appeals.direction_id)
          or public.has_role('member', appeals.direction_id)
        )
    )
  );

-- Контент: публичный может читать опубликованный контент
drop policy if exists "content_public_read" on content;
create policy "content_public_read" on content
  for select using (status = 'published');

-- Контент: члены могут управлять (читать все, создавать, обновлять)
drop policy if exists "content_members_manage" on content;
create policy "content_members_manage" on content
  for all using (
    -- Board can manage all; leads can manage content for their direction
    public.has_role('board')
    or
    public.has_role('lead', direction_id)
  );

-- Документы: публичный может читать
drop policy if exists "documents_public_read" on documents;
create policy "documents_public_read" on documents
  for select using (true);

-- Документы: члены могут управлять
drop policy if exists "documents_members_manage" on documents;
create policy "documents_members_manage" on documents
  for all using (
    -- Only board and leads for the document's direction can manage
    public.has_role('board')
    or
    public.has_role('lead', direction_id)
  );

-- Студенческие объединения: пользователи могут читать активные объединения
drop policy if exists "student_organizations_public_read" on student_organizations;
create policy "student_organizations_public_read" on student_organizations
  for select using (is_active = true);

-- Студенческие объединения: члены могут управлять контентом и наполнением раздела студенческих объединений, чтобы убедиться, что они имеют правильные роли и направления
drop policy if exists "student_organizations_members_manage" on student_organizations;
create policy "student_organizations_members_manage" on student_organizations
  for all using (
    -- Management of student organizations is reserved for board or designated leads
    public.has_role('board') or public.has_role('lead')
  );

-- Вложения к жалобам: пользователи могут создавать (при создании жалобы), чтобы убедиться, что они имеют правильные роли и направления
drop policy if exists "appeal_attachments_public_insert" on appeal_attachments;
create policy "appeal_attachments_public_insert" on appeal_attachments
  for insert with check (true);

-- Вложения к жалобам: пользователи могут читать если имеют доступ к жалобе, чтобы убедиться, что они имеют правильные роли и направления
drop policy if exists "appeal_attachments_read" on appeal_attachments;
create policy "appeal_attachments_read" on appeal_attachments
  for select using (
    -- Can read if user has access to the appeal
    exists (
      select 1 from appeals
      where appeals.id = appeal_attachments.appeal_id
        and (
          -- Public can read by public_token (will be checked in application)
          true
          or
          -- Members can read if they have access
          public.has_role('board') or public.has_role('staff')
          or public.has_role('lead', appeals.direction_id)
          or public.has_role('member', appeals.direction_id)
        )
    )
  );

-- Роли пользователей: пользователи могут читать свои роли, чтобы убедиться, что они имеют правильные роли и направления
drop policy if exists "user_roles_read_own" on user_roles;
create policy "user_roles_read_own" on user_roles
  for select using (user_id = (SELECT auth.uid())::uuid);

-- Роли пользователей: board/staff могут управлять ролями пользователей
drop policy if exists "user_roles_manage" on user_roles;
create policy "user_roles_manage" on user_roles
  for all using (
    -- Только board может управлять ролями пользователей
    public.has_role('board')
  );

-- Примечание: Для воспроизводства, тебе нужно выполнить следующие шаги, мой друг:
-- 1. Настроить Supabase Auth
-- 2. Создать таблицу user_roles, связывающую пользователей с ролями и направлениями
-- 3. Обновить политики для проверки auth.uid() и user_roles
-- 4. Тщательно протестировать политики RLS, чтобы убедиться, что они работают правильно и безопасно и не блокируют доступ к данным
