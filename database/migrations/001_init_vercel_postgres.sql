create extension if not exists "pgcrypto";

create table if not exists directions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  color_key text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

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
  status text not null default 'new' check (status in ('new','in_progress','waiting','closed')),
  public_token uuid default gen_random_uuid(),
  deadline date,
  assigned_to uuid,
  priority text default 'normal' check (priority in ('low','normal','high','urgent')),
  tags text[],
  created_at timestamptz default now(),
  first_response_at timestamptz,
  closed_at timestamptz
);

create table if not exists appeal_attachments (
  id uuid primary key default gen_random_uuid(),
  appeal_id uuid references appeals(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_size integer,
  mime_type text,
  uploaded_at timestamptz default now()
);

create table if not exists appeal_comments (
  id uuid primary key default gen_random_uuid(),
  appeal_id uuid references appeals(id) on delete cascade,
  author_id uuid,
  message text not null,
  is_internal boolean default true,
  created_at timestamptz default now()
);

create table if not exists content (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('news','guide','faq')),
  title text not null,
  slug text unique not null,
  body text not null,
  direction_id uuid references directions(id),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  updated_at timestamptz default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text not null,
  direction_id uuid references directions(id),
  created_at timestamptz default now()
);

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

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role text not null check (role in ('member','lead','board','staff')),
  direction_id uuid references directions(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, role, direction_id)
);

create index if not exists idx_appeals_status on appeals(status);
create index if not exists idx_appeals_direction on appeals(direction_id);
create index if not exists idx_appeals_created_at on appeals(created_at desc);
create index if not exists idx_appeals_public_token on appeals(public_token);
create index if not exists idx_appeals_assigned_to on appeals(assigned_to);
create index if not exists idx_appeals_priority on appeals(priority);
create index if not exists idx_appeals_deadline on appeals(deadline) where deadline is not null;
create index if not exists idx_appeal_attachments_appeal on appeal_attachments(appeal_id);
create index if not exists idx_content_status on content(status);
create index if not exists idx_content_type on content(type);
create index if not exists idx_content_direction on content(direction_id);
create index if not exists idx_content_published_at on content(published_at desc);
create index if not exists idx_content_slug on content(slug);
create index if not exists idx_appeal_comments_appeal on appeal_comments(appeal_id);
create index if not exists idx_appeal_comments_created_at on appeal_comments(created_at desc);
create index if not exists idx_user_roles_user_id on user_roles(user_id);
create index if not exists idx_user_roles_role on user_roles(role);
create index if not exists idx_user_roles_direction on user_roles(direction_id);
create index if not exists idx_directions_slug on directions(slug);
create index if not exists idx_directions_active on directions(is_active) where is_active = true;
create index if not exists idx_student_organizations_active on student_organizations(is_active) where is_active = true;
create index if not exists idx_student_organizations_display_order on student_organizations(display_order);
