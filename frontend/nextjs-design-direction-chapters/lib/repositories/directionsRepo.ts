import { dbQuery } from '../db';

export async function getDirectionBySlug(slug: string) {
  const res = await dbQuery<{
    id: string;
    slug: string;
    title: string;
    description: string | null;
    color_key: string;
    is_active: boolean;
  }>`
    select id, slug, title, description, color_key, is_active
    from directions
    where slug = ${slug} and is_active = true
    limit 1
  `;
  return res.rows[0] ?? null;
}

export async function getActiveDirections() {
  const res = await dbQuery<{
    id: string;
    slug: string;
    title: string;
    description: string | null;
    color_key: string;
  }>`
    select id, slug, title, description, color_key
    from directions
    where is_active = true
    order by created_at asc
  `;
  return res.rows;
}
