import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';

export default function Blog() {
  const { data: posts, loading } = useApiData(() => api.getBlogPosts(), []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-center font-hand text-5xl font-bold gradient-text md:text-6xl">
        the blog
      </h1>
      <p className="mt-3 text-center font-label text-lg text-ink/70">
        notes, half-formed ideas, and the occasional equation.
      </p>

      {loading && <p className="mt-10 text-center font-label">flipping pages...</p>}

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {(posts || []).map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="wobble-hover doodle-shadow flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white"
            >
              {post.cover_image_url && (
                <img src={post.cover_image_url} alt="" className="h-40 w-full object-cover" />
              )}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h2 className="font-hand text-2xl font-bold">{post.title}</h2>
                <p className="font-label text-xs uppercase tracking-wide text-ink/50">
                  {new Date(post.published_at).toLocaleDateString()}
                </p>
                {!!post.tags?.length && (
                  <div className="mt-auto flex flex-wrap gap-1 pt-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-sky/40 px-2 py-0.5 text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {!loading && !posts?.length && (
        <p className="mt-10 text-center font-label text-ink/60">no posts yet — check back soon!</p>
      )}
    </section>
  );
}
