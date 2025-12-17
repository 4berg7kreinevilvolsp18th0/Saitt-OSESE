-- =========================================
-- Public analytics tables for /statistics
-- (Safe for public read; no personal data)
-- =========================================
create extension if not exists "pgcrypto";

-- Daily created/closed counters
create table if not exists appeals_public_daily (
  day date primary key,
  created_count integer not null default 0,
  closed_count integer not null default 0
);

-- Distribution by direction (all-time)
create table if not exists appeals_public_by_direction (
  direction_id uuid primary key,
  total_count integer not null default 0,
  updated_at timestamptz default now()
);

create or replace function _ensure_daily_row(p_day date)
returns void language plpgsql as $$
begin
  insert into appeals_public_daily(day) values (p_day)
  on conflict (day) do nothing;
end;
$$;

create or replace function _inc_direction(p_direction uuid, p_delta integer)
returns void language plpgsql as $$
begin
  insert into appeals_public_by_direction(direction_id, total_count, updated_at)
  values (p_direction, greatest(p_delta,0), now())
  on conflict (direction_id) do update
    set total_count = appeals_public_by_direction.total_count + p_delta,
        updated_at = now();
end;
$$;

create or replace function public.refresh_public_stats()
returns trigger language plpgsql as $$
declare
  d date;
begin
  if (tg_op = 'INSERT') then
    d := (new.created_at at time zone 'UTC')::date;
    perform _ensure_daily_row(d);
    update appeals_public_daily set created_count = created_count + 1 where day = d;

    if new.direction_id is not null then
      perform _inc_direction(new.direction_id, 1);
    end if;

    return new;
  end if;

  if (tg_op = 'UPDATE') then
    if (old.status is distinct from new.status) then
      if (new.status = 'closed' and old.status <> 'closed') then
        d := (coalesce(new.closed_at, now()) at time zone 'UTC')::date;
        perform _ensure_daily_row(d);
        update appeals_public_daily set closed_count = closed_count + 1 where day = d;
      end if;

      if (old.direction_id is null and new.direction_id is not null) then
        perform _inc_direction(new.direction_id, 1);
      end if;
    end if;

    return new;
  end if;

  return null;
end;
$$;

drop trigger if exists trg_refresh_public_stats on appeals;
create trigger trg_refresh_public_stats
after insert or update on appeals
for each row execute function public.refresh_public_stats();

-- Public read policies
alter table appeals_public_daily enable row level security;
alter table appeals_public_by_direction enable row level security;

drop policy if exists "public_read_daily" on appeals_public_daily;
create policy "public_read_daily" on appeals_public_daily
for select using (true);

drop policy if exists "public_read_by_direction" on appeals_public_by_direction;
create policy "public_read_by_direction" on appeals_public_by_direction
for select using (true);
