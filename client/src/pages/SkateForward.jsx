import { motion } from 'framer-motion';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';

export default function SkateForward() {
  const { data: kits, loading } = useApiData(() => api.getSkateForwardKits(), []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="text-5xl">🛼📐</span>
        <h1 className="mt-3 font-hand text-5xl font-bold gradient-text md:text-6xl">
          skate forward
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-ink/80">
          Skate Forward is a project that turns skateboarding into a hands-on physics classroom —
          build kits that ride like normal boards but double as demos for the science happening
          under your feet. Every kit ships with a walkthrough on the YouTube channel below.
        </p>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
          className="wobble-hover doodle-shadow mt-6 inline-block rounded-full border-2 border-ink bg-hot-pink px-6 py-2 font-label text-lg text-white"
        >
          ▶ watch the builds on YouTube
        </a>
      </motion.div>

      <h2 className="mt-16 text-center font-hand text-3xl font-bold">the kits</h2>

      <div className="mt-8 space-y-8">
        {loading && <p className="text-center font-label">loading the kit list...</p>}
        {(kits || []).map((kit, i) => (
          <motion.div
            key={kit.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="doodle-shadow rounded-2xl border-2 border-ink bg-white p-6"
          >
            <p className="font-label text-sm uppercase tracking-wide text-ink/50">
              kit {i + 1}
            </p>
            <h3 className="font-hand text-2xl font-bold">{kit.name}</h3>
            <p className="mt-2 font-body text-ink/80">{kit.description}</p>
            <p className="mt-2 font-body text-sm italic text-ink/60">purpose: {kit.purpose}</p>
            {kit.video_url && (
              <a
                href={kit.video_url}
                target="_blank"
                rel="noreferrer"
                className="wobble-hover mt-3 inline-block font-label text-sm underline"
              >
                watch the build →
              </a>
            )}
          </motion.div>
        ))}
      </div>

      {!loading && !kits?.length && (
        <p className="mt-10 text-center font-label text-ink/60">
          kits are still being drafted — come back soon!
        </p>
      )}
    </section>
  );
}
