import Link from 'next/link';
import { DIRECTIONS } from '../../lib/directions';
import Badge from '../../components/Badge';

export default function DocumentsPage() {
  // В будущем это будет загружаться из БД или CMS
  const documentCategories = [
    {
      title: 'Положения и регламенты',
      description: 'Основные документы ОСС',
      documents: [
        { title: 'Положение об ОСС ДВФУ', url: '#', type: 'regulation' },
        { title: 'Регламент работы комитетов', url: '#', type: 'regulation' },
      ],
    },
    {
      title: 'Шаблоны заявлений',
      description: 'Готовые формы для обращений',
      documents: [
        { title: 'Заявление на стипендию', url: '#', type: 'template' },
        { title: 'Заявление на апелляцию', url: '#', type: 'template' },
      ],
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-semibold light:text-gray-900">Документы</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 max-w-3xl light:text-gray-600">
        Положения, регламенты, шаблоны заявлений и полезные ссылки. Документы организованы по категориям и направлениям.
      </p>

      <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-8">
        {documentCategories.map((category, i) => (
          <section key={i} className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 light:text-gray-900">{category.title}</h2>
            <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4 light:text-gray-500">{category.description}</p>
            <div className="space-y-2 sm:space-y-3">
              {category.documents.map((doc, j) => (
                <Link
                  key={j}
                  href={doc.url}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 light:bg-gray-50 light:border-gray-200 light:hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <Badge variant={doc.type === 'regulation' ? 'info' : 'success'}>
                      {doc.type === 'regulation' ? 'Регламент' : 'Шаблон'}
                    </Badge>
                    <span className="font-medium text-sm sm:text-base truncate light:text-gray-900">{doc.title}</span>
                  </div>
                  <span className="text-white/40 flex-shrink-0 ml-2 light:text-gray-400">→</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-8 sm:mt-10 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 light:text-gray-900">Документы по направлениям</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {DIRECTIONS.map((dir) => (
            <Link
              key={dir.slug}
              href={`/directions/${dir.slug}`}
              className="p-3 sm:p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 light:bg-gray-50 light:border-gray-200 light:hover:bg-gray-100"
            >
              <div className="font-medium text-sm sm:text-base light:text-gray-900">{dir.title}</div>
              <div className="mt-1 text-xs sm:text-sm text-white/60 light:text-gray-500">Документы и материалы</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
