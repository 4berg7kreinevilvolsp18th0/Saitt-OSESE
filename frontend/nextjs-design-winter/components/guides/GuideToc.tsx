type TocItem = {
  id: string;
  title: string;
  level?: 2 | 3;
};

export default function GuideToc({ items }: { items: TocItem[] }) {
  if (!items.length) return null;

  return (
    <>
      <aside className="hidden lg:block lg:w-72 shrink-0">
        <div className="sticky top-24 rounded-xl border border-white/10 bg-white/5 p-4 light:bg-white light:border-gray-200">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 light:text-gray-700">
            Содержание
          </h3>
          <ul className="mt-3 space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`text-sm text-white/70 hover:text-white transition light:text-gray-700 light:hover:text-oss-red ${
                    item.level === 3 ? 'pl-3 block' : ''
                  }`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <details className="lg:hidden rounded-xl border border-white/10 bg-white/5 p-4 light:bg-white light:border-gray-200">
        <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wider text-white/80 light:text-gray-700">
          Содержание
        </summary>
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`text-sm text-white/70 hover:text-white transition light:text-gray-700 light:hover:text-oss-red ${
                  item.level === 3 ? 'pl-3 block' : ''
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}

