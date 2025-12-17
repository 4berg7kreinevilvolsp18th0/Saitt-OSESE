import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Badge from '../../../components/Badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ContentItem({ params }: { params: { slug: string } }) {
  // Try to find in news or guides
  const newsPath = path.join(process.cwd(), 'content/news', `${params.slug}.md`);
  const guidesPath = path.join(process.cwd(), 'content/guides', `${params.slug}.md`);

  let filePath: string | null = null;
  let contentType: 'news' | 'guide' = 'news';

  if (fs.existsSync(newsPath)) {
    filePath = newsPath;
    contentType = 'news';
  } else if (fs.existsSync(guidesPath)) {
    filePath = guidesPath;
    contentType = 'guide';
  }

  if (!filePath) {
    notFound();
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const title = lines.find((line) => line.startsWith('# '))?.replace('# ', '') || params.slug;
  const body = content.replace(/^# .*$/m, '').trim(); // Remove title from body

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <article>
        <div className="mb-6">
          <Badge variant={contentType === 'news' ? 'info' : 'success'}>
            {contentType === 'news' ? 'Новость' : 'Гайд'}
          </Badge>
        </div>
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <div className="prose prose-invert prose-lg max-w-none text-white/80 markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="mt-4 leading-relaxed" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc ml-6 mt-2 space-y-1" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal ml-6 mt-2 space-y-1" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="ml-2" {...props} />
              ),
              code: ({ node, inline, ...props }: any) =>
                inline ? (
                  <code
                    className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  />
                ) : (
                  <code
                    className="block bg-white/5 p-4 rounded-xl overflow-x-auto text-sm font-mono"
                    {...props}
                  />
                ),
              a: ({ node, ...props }) => (
                <a
                  className="text-oss-red hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-white/20 pl-4 italic my-4 text-white/70"
                  {...props}
                />
              ),
            }}
          >
            {body}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
