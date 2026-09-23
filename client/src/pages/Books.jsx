import { motion } from 'framer-motion';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';

function Stars({ rating = 0 }) {
  const full = Math.round(rating);
  return (
    <span className="text-sunshine" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}
      <span className="text-ink/20">{'★'.repeat(Math.max(0, 5 - full))}</span>
    </span>
  );
}

export default function Books() {
  const { data: books, loading } = useApiData(() => api.getBooks(), []);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-center font-hand text-5xl font-bold gradient-text md:text-6xl">
        the bookshelf
      </h1>
      <p className="mt-3 text-center font-label text-lg text-ink/70">
        everything I've read and loved, pinned up like a corkboard.
      </p>

      {loading && <p className="mt-10 text-center font-label">stacking books...</p>}

      <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
        {(books || []).map((book, i) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: (i % 2 === 0 ? -1 : 1) * (2 + (i % 3)) }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="wobble-hover doodle-shadow bg-white p-3 pb-5"
          >
            <div className="flex h-40 items-center justify-center overflow-hidden bg-paper-dark">
              {book.cover_image_url ? (
                <img src={book.cover_image_url} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl">📖</span>
              )}
            </div>
            <h2 className="mt-3 font-hand text-xl font-bold leading-tight">{book.title}</h2>
            <p className="font-label text-sm text-ink/60">{book.author}</p>
            {book.rating != null && <Stars rating={Number(book.rating)} />}
            {book.description && (
              <p className="mt-1 font-body text-xs text-ink/70">{book.description}</p>
            )}
          </motion.div>
        ))}
      </div>

      {!loading && !books?.length && (
        <p className="mt-10 text-center font-label text-ink/60">the shelf is empty — for now.</p>
      )}
    </section>
  );
}
