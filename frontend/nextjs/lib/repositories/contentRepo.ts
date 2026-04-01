import { dbQuery } from '../db';

export async function getPublishedContent(limit?: number) {
  if (limit) {
    const withDirection = await dbQuery<{
      id: string;
      type: 'news' | 'guide' | 'faq';
      title: string;
      slug: string;
      body?: string;
      published_at: string | null;
      direction_id: string | null;
      direction_title: string | null;
      direction_slug: string | null;
    }>`
      select c.id, c.type, c.title, c.slug, c.body, c.published_at, c.direction_id,
             d.title as direction_title, d.slug as direction_slug
      from content c
      left join directions d on d.id = c.direction_id
      where c.status = 'published'
      order by c.published_at desc nulls last
      limit ${limit}
    `;
    return withDirection.rows;
  }

  const withDirection = await dbQuery<{
    id: string;
    type: 'news' | 'guide' | 'faq';
    title: string;
    slug: string;
    body?: string;
    published_at: string | null;
    direction_id: string | null;
    direction_title: string | null;
    direction_slug: string | null;
  }>`
    select c.id, c.type, c.title, c.slug, c.body, c.published_at, c.direction_id,
           d.title as direction_title, d.slug as direction_slug
    from content c
    left join directions d on d.id = c.direction_id
    where c.status = 'published'
    order by c.published_at desc nulls last
  `;
  return withDirection.rows;
}

export async function getPublishedContentByType(type: 'news' | 'guide' | 'faq', limit?: number) {
  if (limit) {
    const res = await dbQuery<{
      id: string;
      type: 'news' | 'guide' | 'faq';
      title: string;
      slug: string;
      published_at: string | null;
      direction_id: string | null;
      direction_title: string | null;
    }>`
      select c.id, c.type, c.title, c.slug, c.published_at, c.direction_id, d.title as direction_title
      from content c
      left join directions d on d.id = c.direction_id
      where c.status = 'published' and c.type = ${type}
      order by c.published_at desc nulls last
      limit ${limit}
    `;
    return res.rows;
  }

  const res = await dbQuery<{
    id: string;
    type: 'news' | 'guide' | 'faq';
    title: string;
    slug: string;
    published_at: string | null;
    direction_id: string | null;
    direction_title: string | null;
  }>`
    select c.id, c.type, c.title, c.slug, c.published_at, c.direction_id, d.title as direction_title
    from content c
    left join directions d on d.id = c.direction_id
    where c.status = 'published' and c.type = ${type}
    order by c.published_at desc nulls last
  `;
  return res.rows;
}

export async function getPublishedContentBySlug(slug: string) {
  const res = await dbQuery<{
    id: string;
    type: 'news' | 'guide' | 'faq';
    title: string;
    slug: string;
    body: string;
    published_at: string | null;
    direction_id: string | null;
  }>`
    select id, type, title, slug, body, published_at, direction_id
    from content
    where slug = ${slug} and status = 'published'
    limit 1
  `;
  return res.rows[0] ?? null;
}
