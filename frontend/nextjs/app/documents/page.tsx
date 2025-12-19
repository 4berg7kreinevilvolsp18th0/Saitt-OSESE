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
        Положения, регламенты, шаблоны заявлений и полезные ссылки. Документы организованы по категориям и направлениям.
      </p>

      <div className="mt-10 space-y-8">
        {documentCategories.map((category, i) => (
          <section key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
            <p className="text-sm text-white/60 mb-4">{category.description}</p>
            <div className="space-y-3">
              {category.documents.map((doc, j) => (
                <Link
                  key={j}
                  href={doc.url}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={doc.type === 'regulation' ? 'info' : 'success'}>
                      {doc.type === 'regulation' ? 'Регламент' : 'Шаблон'}
                    </Badge>
                    <span className="font-medium">{doc.title}</span>
                  </div>
                  <span className="text-white/40">→</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4">Документы по направлениям</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIRECTIONS.map((dir) => (
            <Link
              key={dir.slug}
              href={`/directions/${dir.slug}`}
              className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <div className="font-medium">{dir.title}</div>
              <div className="mt-1 text-sm text-white/60">Документы и материалы</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
