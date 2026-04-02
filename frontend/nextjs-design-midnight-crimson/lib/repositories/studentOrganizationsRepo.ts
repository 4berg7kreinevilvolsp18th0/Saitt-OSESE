import { dbQuery } from '../db';

export async function getActiveStudentOrganizations() {
  const res = await dbQuery<{
    id: string;
    title: string;
    description: string | null;
    logo_url: string | null;
    website_url: string | null;
    telegram_url: string | null;
    vk_url: string | null;
    email: string | null;
    contact_person: string | null;
    display_order: number;
  }>`
    select id, title, description, logo_url, website_url, telegram_url, vk_url, email, contact_person, display_order
    from student_organizations
    where is_active = true
    order by display_order asc, created_at asc
  `;
  return res.rows;
}
