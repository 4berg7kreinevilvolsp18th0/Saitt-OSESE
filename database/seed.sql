-- ===============================
-- Seed data for OSS DVFU Database
-- ===============================

-- Insert Directions
insert into directions (slug, title, description, color_key, is_active) values
  ('legal', 'Правовой комитет', 'Разъяснения, защита прав, апелляции, конфликты, регламенты.', 'legal', true),
  ('infrastructure', 'Инфраструктурный блок', 'Общежития, кампус, аудитории, быт и сервисы.', 'infrastructure', true),
  ('scholarship', 'Стипендиальный комитет', 'Стипендии, выплаты, сроки, причины удержаний, консультации.', 'scholarship', true),
  ('international', 'Иностранным студентам', 'Адаптация, коммуникация, академические и миграционные вопросы.', 'international', true),
  ('other', 'Другое / FAQ', 'Если не нашли подходящую категорию — мы поможем маршрутизировать.', 'neutral', true)
on conflict (slug) do nothing;

-- Insert sample appeals (for testing)
-- Note: В production эти данные не нужны, только для разработки
-- Проверяем, что обращений еще нет, чтобы не создавать дубликаты
insert into appeals (direction_id, title, description, contact_type, contact_value, status, is_anonymous)
select
  d.id,
  'Тестовое обращение: ' || d.title,
  'Это тестовое обращение для проверки работы системы. ' || d.description,
  'email',
  'test@example.com',
  case (random() * 3)::int
    when 0 then 'new'
    when 1 then 'in_progress'
    when 2 then 'waiting'
    else 'closed'
  end,
  false
from directions d
where d.is_active = true
  and not exists (
    select 1 from appeals 
    where appeals.direction_id = d.id 
      and appeals.title = 'Тестовое обращение: ' || d.title
  )
limit 10;

-- Insert sample content
insert into content (type, title, slug, body, direction_id, status, published_at)
select
  'news',
  'Новость: ' || d.title,
  'news-' || d.slug || '-1',
  '# Новость от ' || d.title || E'\n\nЭто пример новости для направления ' || d.title || '.\n\n## Детали\n\nПодробная информация о новости.\n\n- Пункт 1\n- Пункт 2\n- Пункт 3',
  d.id,
  'published',
  now() - (random() * 30 || ' days')::interval
from directions d
where d.is_active = true
limit 5
on conflict (slug) do nothing;

insert into content (type, title, slug, body, direction_id, status, published_at)
select
  'guide',
  'Гайд: Как работать с ' || d.title,
  'guide-' || d.slug || '-1',
  '# Гайд по ' || d.title || E'\n\nЭто пример гайда для направления ' || d.title || '.\n\n## Шаг 1\n\nОписание шага.\n\n## Шаг 2\n\nПродолжение инструкции.',
  d.id,
  'published',
  now() - (random() * 60 || ' days')::interval
from directions d
where d.is_active = true
limit 5
on conflict (slug) do nothing;

