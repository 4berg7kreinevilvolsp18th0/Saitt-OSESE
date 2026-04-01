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
