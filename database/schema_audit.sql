-- Таблица для истории изменений обращений (Audit Trail)
-- Это позволяет отслеживать все изменения статусов, назначений и т.д.

create table if not exists appeal_history (
    id uuid primary key default gen_random_uuid(),
    appeal_id uuid references appeals(id) on delete cascade,
    changed_by uuid references auth.users(id), -- Кто внес изменение
    action text not null, -- 'status_changed', 'assigned', 'priority_changed', 'deadline_set', 'comment_added'
    old_value text, -- Старое значение (JSON или текст)
    new_value text, -- Новое значение (JSON или текст)
    description text, -- Описание изменения
    created_at timestamptz default now()
);

-- Индексы для быстрого поиска
create index if not exists idx_appeal_history_appeal on appeal_history(appeal_id);
create index if not exists idx_appeal_history_changed_by on appeal_history(changed_by);
create index if not exists idx_appeal_history_created_at on appeal_history(created_at desc);
create index if not exists idx_appeal_history_action on appeal_history(action);

-- RLS политики для appeal_history
alter table appeal_history enable row level security;

-- Члены ОСС могут видеть историю обращений своего направления
drop policy if exists "appeal_history_read" on appeal_history;
create policy "appeal_history_read" on appeal_history
  for select using (
    exists (
      select 1 from appeals
      where appeals.id = appeal_history.appeal_id
        and (
          public.has_role('board') or public.has_role('staff')
          or public.has_role('lead', appeals.direction_id)
          or public.has_role('member', appeals.direction_id)
        )
    )
  );

-- Только члены ОСС могут создавать записи истории
drop policy if exists "appeal_history_insert" on appeal_history;
create policy "appeal_history_insert" on appeal_history
  for insert with check (
    public.has_role('board') or public.has_role('staff')
    or public.has_role('lead')
    or public.has_role('member')
  );

-- Функция для автоматического создания записи истории при изменении обращения
create or replace function log_appeal_change()
returns trigger as $$
begin
    -- Логируем изменение статуса
    if TG_OP = 'UPDATE' and OLD.status is distinct from NEW.status then
        insert into appeal_history (
            appeal_id,
            changed_by,
            action,
            old_value,
            new_value,
            description
        ) values (
            NEW.id,
            auth.uid(),
            'status_changed',
            OLD.status,
            NEW.status,
            'Статус изменён с ' || OLD.status || ' на ' || NEW.status
        );
    end if;

    -- Логируем изменение приоритета
    if TG_OP = 'UPDATE' and OLD.priority is distinct from NEW.priority then
        insert into appeal_history (
            appeal_id,
            changed_by,
            action,
            old_value,
            new_value,
            description
        ) values (
            NEW.id,
            auth.uid(),
            'priority_changed',
            OLD.priority,
            NEW.priority,
            'Приоритет изменён с ' || COALESCE(OLD.priority, 'normal') || ' на ' || COALESCE(NEW.priority, 'normal')
        );
    end if;

    -- Логируем назначение ответственного
    if TG_OP = 'UPDATE' and OLD.assigned_to is distinct from NEW.assigned_to then
        insert into appeal_history (
            appeal_id,
            changed_by,
            action,
            old_value,
            new_value,
            description
        ) values (
            NEW.id,
            auth.uid(),
            'assigned',
            COALESCE(OLD.assigned_to::text, 'не назначен'),
            COALESCE(NEW.assigned_to::text, 'не назначен'),
            'Ответственный изменён'
        );
    end if;

    -- Логируем установку дедлайна
    if TG_OP = 'UPDATE' and OLD.deadline is distinct from NEW.deadline then
        insert into appeal_history (
            appeal_id,
            changed_by,
            action,
            old_value,
            new_value,
            description
        ) values (
            NEW.id,
            auth.uid(),
            'deadline_set',
            COALESCE(OLD.deadline::text, 'не установлен'),
            COALESCE(NEW.deadline::text, 'не установлен'),
            'Дедлайн изменён'
        );
    end if;

    return NEW;
end;
$$ language plpgsql security definer;

-- Триггер для автоматического логирования изменений
drop trigger if exists appeal_change_trigger on appeals;
create trigger appeal_change_trigger
    after update on appeals
    for each row
    execute function log_appeal_change();

