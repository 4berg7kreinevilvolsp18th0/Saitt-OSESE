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
      className="professional-card block rounded-xl sm:rounded-2xl p-5 sm:p-7 hover-lift focus-ring animate-fade-in-up"
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={typeColors[type]}>{typeLabels[type]}</Badge>
            {direction && (
              <Badge variant="default" className="text-xs">
                {direction}
              </Badge>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 light:text-gray-900">{title}</h3>
          {excerpt && <p className="text-xs sm:text-sm text-white/70 line-clamp-2 light:text-gray-600">{excerpt}</p>}
        </div>
      </div>
      {publishedAt && (
        <div className="mt-3 sm:mt-4 text-xs text-white/50 light:text-gray-400">
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

