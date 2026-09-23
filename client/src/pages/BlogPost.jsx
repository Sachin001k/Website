import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';

// Markdown images use the title slot for a caption: ![alt text](url "caption").
// Alt text is required for accessibility and is always rendered as-is on the <img>.
function MarkdownImage({ src, alt, title }) {
  return (
    <figure className="my-6">
      <img src={src} alt={alt || ''} className="doodle-shadow w-full rounded-xl border-2 border-ink" />
      {title && (
        <figcaption className="mt-2 text-center font-label text-sm text-ink/60">{title}</figcaption>
      )}
    </figure>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useApiData(() => api.getBlogPost(slug), [slug]);

  if (loading) return <p className="px-6 py-16 text-center font-label">flipping pages...</p>;

  if (error || !post) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-label text-xl">couldn't find that post.</p>
        <Link to="/blog" className="wobble-hover mt-4 inline-block font-label underline">
          back to the blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <Link to="/blog" className="wobble-hover font-label text-sm">
        ← back to the blog
      </Link>

      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt=""
          className="doodle-shadow mt-6 h-64 w-full rounded-2xl border-2 border-ink object-cover"
        />
      )}

      <h1 className="mt-6 font-hand text-4xl font-bold gradient-text md:text-5xl">{post.title}</h1>
      <p className="mt-2 font-label text-xs uppercase tracking-wide text-ink/50">
        {new Date(post.published_at).toLocaleDateString()}
      </p>

      <div className="prose prose-lg mt-8 max-w-none font-body prose-headings:font-hand">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{ img: MarkdownImage }}
        >
          {post.content_md}
        </ReactMarkdown>
      </div>
    </article>
  );
}
