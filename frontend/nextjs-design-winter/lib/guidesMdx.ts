import fs from 'fs';
import path from 'path';
import { committeeColorKey } from './theme';
import type { GuideMeta } from './guides';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'guides');

type Frontmatter = Record<string, string>;

function parseFrontmatter(raw: string): { frontmatter: Frontmatter; content: string } {
  if (!raw.startsWith('---')) return { frontmatter: {}, content: raw };

  const closeIndex = raw.indexOf('\n---', 3);
  if (closeIndex === -1) return { frontmatter: {}, content: raw };

  const header = raw.slice(3, closeIndex).trim();
  const body = raw.slice(closeIndex + 4).trim();

  const frontmatter: Frontmatter = {};
  header.split('\n').forEach((line) => {
    const sep = line.indexOf(':');
    if (sep === -1) return;
    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim().replace(/^"|"$/g, '');
    frontmatter[key] = value;
  });

  return { frontmatter, content: body };
}

export function getMdxGuideSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx$/, ''));
}

export function getMdxGuideBySlug(slug: string): { meta: GuideMeta; markdown: string } | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, content } = parseFrontmatter(raw);

  const title = frontmatter.title || slug;
  const committee = frontmatter.committee || 'ОСС';

  const meta: GuideMeta = {
    title,
    slug,
    committee,
    level: frontmatter.level === 'basic' ? 'basic' : 'deepdive',
    updatedAt: frontmatter.updatedAt || new Date().toISOString().slice(0, 10),
    status: frontmatter.status === 'published' ? 'published' : 'draft',
    tags: ['mdx', 'pilot'],
    description: frontmatter.description || title,
    colorKey: committeeColorKey(committee),
  };

  return { meta, markdown: content };
}
