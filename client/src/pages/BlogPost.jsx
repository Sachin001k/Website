import { useParams, Link } from 'react-router-dom';
import Markdown from '../components/Markdown';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useApiData(() => api.getBlogPost(slug), [slug]);

  if (loading) return <p className="px-6 py-16 text-center font-label">flipping pages...</p>;

  if (error || !post) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-label text-xl">couldn't find that post.</p>
        <Link to="/blog" className="wobble-hover mt-4 inline-block font-label underline">
          back to The Metrics of Motion
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <Link to="/blog" className="wobble-hover font-label text-sm">
        ← back to The Metrics of Motion
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

      <div className="mt-8">
        <Markdown className="prose prose-lg">{post.content_md}</Markdown>
      </div>
    </article>
  );
}
