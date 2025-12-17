import Link from 'next/link';
import Badge from './Badge';

type ContentCardProps = {
  title: string;
  slug: string;
  type: 'news' | 'guide' | 'faq';
  direction?: string;
  publishedAt?: string;
  excerpt?: string;
};

export default function ContentCard({
  title,
  slug,
  type,
  direction,
  publishedAt,
  excerpt,
}: ContentCardProps) {
  const typeLabels = {
    news: 'Новость',
    guide: 'Гайд',
    faq: 'FAQ',
  };

  const typeColors = {
    news: 'info',
    guide: 'success',
    faq: 'warning',
  } as const;

  return (
    <Link
      href={`/content/${slug}`}
      className="block rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={typeColors[type]}>{typeLabels[type]}</Badge>
            {direction && (
              <Badge variant="default" className="text-xs">
                {direction}
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {excerpt && <p className="text-sm text-white/70 line-clamp-2">{excerpt}</p>}
        </div>
      </div>
      {publishedAt && (
        <div className="mt-4 text-xs text-white/50">
          {new Date(publishedAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      )}
    </Link>
  );
}

