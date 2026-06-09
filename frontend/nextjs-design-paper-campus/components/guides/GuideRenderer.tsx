import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { GuideMeta } from '../../lib/guides';
import GuideLayout from './GuideLayout';

type Props = {
  meta: GuideMeta;
  markdown: string;
};

function extractToc(markdown: string): Array<{ id: string; title: string; level: 2 | 3 }> {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('## ') || line.startsWith('### '))
    .map((line) => {
      const level = line.startsWith('### ') ? 3 : 2;
      const title = line.replace(/^#{2,3}\s+/, '').trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-zа-я0-9\s-]/gi, '')
        .trim()
        .replace(/\s+/g, '-');
      return { id, title, level } as const;
    });
}

export default function GuideRenderer({ meta, markdown }: Props) {
  const tocItems = extractToc(markdown);

  return (
    <GuideLayout meta={meta} summary={meta.description} badges={['MDX', 'Пилот']} tocItems={tocItems}>
      <div className="prose prose-invert light:prose-stone max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => {
              const text = String(children);
              const id = text
                .toLowerCase()
                .replace(/[^a-zа-я0-9\s-]/gi, '')
                .trim()
                .replace(/\s+/g, '-');
              return (
                <h2 id={id} className="scroll-mt-28">
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const text = String(children);
              const id = text
                .toLowerCase()
                .replace(/[^a-zа-я0-9\s-]/gi, '')
                .trim()
                .replace(/\s+/g, '-');
              return (
                <h3 id={id} className="scroll-mt-28">
                  {children}
                </h3>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </GuideLayout>
  );
}
