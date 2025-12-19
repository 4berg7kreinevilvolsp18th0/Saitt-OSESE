
-- ===============================
-- OSSID / DVFU OСС Database Schema
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

-- Appeals
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

-- Appeal Attachments (Вложения к обращениям)
create table if not exists appeal_attachments (
    id uuid primary key default gen_random_uuid(),
    appeal_id uuid references appeals(id) on delete cascade,
    file_name text not null,
-- Appeal comments
create table if not exists appeal_comments (
    id uuid primary key default gen_random_uuid(),
    appeal_id uuid references appeals(id) on delete cascade,
    author_id uuid,
    message text not null,
    is_internal boolean default true,
    created_at timestamptz default now()
);

-- Content (news, guides, faq)
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

-- Documents
create table if not exists documents (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    file_url text not null,
    direction_id uuid references directions(id),
    created_at timestamptz default now()
);

-- Student Organizations (Студенческие объединения)
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

-- User Roles (for Supabase Auth integration)
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

-- Appeals indexes
create index if not exists idx_appeals_status on appeals(status);
create index if not exists idx_appeals_direction on appeals(direction_id);
create index if not exists idx_appeals_created_at on appeals(created_at desc);
create index if not exists idx_appeals_public_token on appeals(public_token);

-- Content indexes
create index if not exists idx_content_status on content(status);
create index if not exists idx_content_type on content(type);
create index if not exists idx_content_direction on content(direction_id);
create index if not exists idx_content_published_at on content(published_at desc);
create index if not exists idx_content_slug on content(slug);

-- Appeal comments indexes
create index if not exists idx_appeal_comments_appeal on appeal_comments(appeal_id);
create index if not exists idx_appeal_comments_created_at on appeal_comments(created_at desc);

-- User roles indexes
create index if not exists idx_user_roles_user_id on user_roles(user_id);
create index if not exists idx_user_roles_role on user_roles(role);
create index if not exists idx_user_roles_direction on user_roles(direction_id);

-- Directions indexes
create index if not exists idx_directions_slug on directions(slug);
create index if not exists idx_directions_active on directions(is_active) where is_active = true;

-- Student organizations indexes
create index if not exists idx_student_organizations_active on student_organizations(is_active) where is_active = true;
create index if not exists idx_student_organizations_display_order on student_organizations(display_order);

-- ===============================
-- Row Level Security (RLS) Policies
-- ===============================

-- Enable RLS on all tables
alter table appeals enable row level security;
alter table appeal_comments enable row level security;
alter table content enable row level security;
alter table documents enable row level security;
alter table directions enable row level security;
alter table student_organizations enable row level security;
alter table user_roles enable row level security;

-- Directions: public read for active directions
drop policy if exists "directions_public_read" on directions;
create policy "directions_public_read" on directions
  for select using (is_active = true);

-- Appeals: public can create
drop policy if exists "appeals_public_insert" on appeals;
create policy "appeals_public_insert" on appeals
  for insert with check (true);

-- Appeals: public can read by public_token
drop policy if exists "appeals_public_read_by_token" on appeals;
create policy "appeals_public_read_by_token" on appeals
  for select using (
    -- Allow read if public_token matches (will be checked in application)
    true
  );

-- Helper function to check user role
create or replace function public.has_role(p_role text, p_direction_id uuid default null)
returns boolean
language plpgsql
security definer
as $$
begin
  if p_direction_id is null then
    -- Check if user has role without direction (board/staff)
    return exists (
      select 1 from user_roles
      where user_id = auth.uid()
        and role = p_role
        and direction_id is null
    );
  else
    -- Check if user has role for specific direction
    return exists (
      select 1 from user_roles
      where user_id = auth.uid()
        and role = p_role
        and (direction_id = p_direction_id or direction_id is null)
    );
  end if;
end;
$$;

-- Appeals: members can read appeals of their direction
drop policy if exists "appeals_members_read" on appeals;
create policy "appeals_members_read" on appeals
  for select using (
    -- Board and staff can see all
    public.has_role('board') or public.has_role('staff')
    or
    -- Lead can see appeals of their direction
    (public.has_role('lead', direction_id) and direction_id is not null)
    or
    -- Member can see appeals of their direction
    (public.has_role('member', direction_id) and direction_id is not null)
  );

-- Appeals: members can update status
drop policy if exists "appeals_members_update" on appeals;
create policy "appeals_members_update" on appeals
  for update using (
    -- Board and staff can update all
    public.has_role('board') or public.has_role('staff')
    or
    -- Lead can update appeals of their direction
    (public.has_role('lead', direction_id) and direction_id is not null)
    or
    -- Member can update appeals of their direction
    (public.has_role('member', direction_id) and direction_id is not null)
  );

-- Appeal Comments: members can read and create
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

-- Content: public can read published content
drop policy if exists "content_public_read" on content;
create policy "content_public_read" on content
  for select using (status = 'published');

-- Content: members can manage (read all, insert, update)
drop policy if exists "content_members_manage" on content;
create policy "content_members_manage" on content
  for all using (
    public.has_role('board') or public.has_role('staff') or public.has_role('lead')
  );

-- Documents: public can read
drop policy if exists "documents_public_read" on documents;
create policy "documents_public_read" on documents
  for select using (true);

-- Documents: members can manage
drop policy if exists "documents_members_manage" on documents;
create policy "documents_members_manage" on documents
  for all using (
    public.has_role('board') or public.has_role('staff') or public.has_role('lead')
  );

-- Student Organizations: public can read active organizations
drop policy if exists "student_organizations_public_read" on student_organizations;
create policy "student_organizations_public_read" on student_organizations
  for select using (is_active = true);

-- Student Organizations: members can manage
drop policy if exists "student_organizations_members_manage" on student_organizations;
create policy "student_organizations_members_manage" on student_organizations
  for all using (
    public.has_role('board') or public.has_role('staff') or public.has_role('lead')
  );

-- User Roles: users can read their own roles
drop policy if exists "user_roles_read_own" on user_roles;
create policy "user_roles_read_own" on user_roles
  for select using (user_id = auth.uid());

-- User Roles: board/staff can manage all roles
drop policy if exists "user_roles_manage" on user_roles;
create policy "user_roles_manage" on user_roles
  for all using (
    public.has_role('board') or public.has_role('staff')
  );

-- Note: For production, you need to:
-- 1. Set up Supabase Auth
-- 2. Create user_roles table linking users to roles and directions
-- 3. Update policies to check auth.uid() and user_roles
-- 4. Test RLS policies thoroughly
