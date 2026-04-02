create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text,
  is_active boolean not null default true,
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_users_email on users(email);
create index if not exists idx_users_active on users(is_active) where is_active = true;

alter table user_roles
  drop constraint if exists user_roles_user_id_fkey;

alter table user_roles
  add constraint user_roles_user_id_fkey
  foreign key (user_id) references users(id) on delete cascade;

alter table appeals
  drop constraint if exists appeals_assigned_to_fkey;

alter table appeals
  add constraint appeals_assigned_to_fkey
  foreign key (assigned_to) references users(id) on delete set null;

alter table appeal_comments
  drop constraint if exists appeal_comments_author_id_fkey;

alter table appeal_comments
  add constraint appeal_comments_author_id_fkey
  foreign key (author_id) references users(id) on delete set null;
