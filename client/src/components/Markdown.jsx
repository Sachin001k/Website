import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Markdown images use the title slot for a caption: ![alt text](url "caption").
// Alt text is required for accessibility and is always rendered as-is on the <img>.
function MarkdownImage({ src, alt, title }) {
  return (
    <figure className="my-6">
      <img src={src} alt={alt || ''} className="doodle-shadow w-full rounded-xl border-2 border-ink" />
      {title && <figcaption className="mt-2 text-center font-label text-sm text-ink/60">{title}</figcaption>}
    </figure>
  );
}

// Markdown + LaTeX ($...$ / $$...$$) in the site's comic body font.
export default function Markdown({ children, className = 'prose' }) {
  return (
    <div className={`${className} max-w-none font-body prose-headings:font-hand`}>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={{ img: MarkdownImage }}>
        {children || ''}
      </ReactMarkdown>
    </div>
  );
}
