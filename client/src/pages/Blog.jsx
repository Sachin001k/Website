import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { useApiData } from '../hooks/useApiData';
import { useSettings } from '../hooks/useSettings';
import { api } from '../lib/api';

const DEFAULT_MEDIUM_URL = 'https://medium.com/@cece_11925';

function PostCard({ post }) {
  const body = (
    <>
      {post.cover_image_url && <img src={post.cover_image_url} alt="" className="h-40 w-full object-cover" />}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="font-hand text-2xl font-bold">{post.title}</h2>
        {post.summary && <p className="font-body text-sm text-ink/70">{post.summary}</p>}
        <p className="font-label text-xs uppercase tracking-wide text-ink/50">
          {new Date(post.published_at).toLocaleDateString()}
          {post.external_url && ' · on Medium ↗'}
        </p>
        {!!post.tags?.length && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-baby-blue/60 px-2 py-0.5 text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
  const className = 'wobble-hover doodle-shadow flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white';

  return post.external_url ? (
    <a href={post.external_url} target="_blank" rel="noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link to={`/blog/${post.slug}`} className={className}>
      {body}
    </Link>
  );
}

export default function Blog() {
  const settings = useSettings();
  const { data: posts, loading } = useApiData(() => api.getBlogPosts(), []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <PageHeader title="The Metrics of Motion" subtitle="using physics to analyse speed skating — one equation at a time.">
        <a
          href={settings.medium_url || DEFAULT_MEDIUM_URL}
          target="_blank"
          rel="noreferrer"
          className="wobble-hover doodle-shadow mt-8 inline-block rounded-full border-2 border-ink bg-white px-5 py-2 font-label text-lg"
        >
          ✍️ read my articles on Medium ↗
        </a>
      </PageHeader>

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
            <PostCard post={post} />
          </motion.div>
        ))}
      </div>

      {!loading && !posts?.length && (
        <p className="mt-10 text-center font-label text-ink/60">no posts yet — check back soon!</p>
      )}
    </section>
  );
}
