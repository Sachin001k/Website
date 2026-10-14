import { motion } from 'framer-motion';
import Markdown from '../components/Markdown';
import PageHeader from '../components/PageHeader';
import { useApiData } from '../hooks/useApiData';
import { useSettings } from '../hooks/useSettings';
import { api } from '../lib/api';

export default function Reup() {
  const settings = useSettings();
  const { data: kits, loading } = useApiData(() => api.getReupKits(), []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <PageHeader title="ReUP" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="doodle-shadow relative mx-auto mt-10 max-w-2xl rounded-2xl border-2 border-ink bg-white p-6"
      >
        <span className="tape" aria-hidden="true" />
        <Markdown className="prose text-ink/80">{settings.reup_intro || 'An introduction to ReUP is coming soon.'}</Markdown>
        {settings.reup_youtube_url && (
          <a
            href={settings.reup_youtube_url}
            target="_blank"
            rel="noreferrer"
            className="wobble-hover doodle-shadow mt-5 inline-block rounded-full border-2 border-ink gradient-bg px-6 py-2 font-label text-lg"
          >
            ▶ watch the builds on YouTube
          </a>
        )}
      </motion.div>

      <h2 className="mt-16 text-center font-hand text-4xl font-bold">the plan: the kits</h2>

      <div className="mt-8 space-y-10">
        {loading && <p className="text-center font-label">loading the kit list...</p>}
        {(kits || []).map((kit, i) => (
          <motion.article
            key={kit.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="doodle-shadow overflow-hidden rounded-2xl border-2 border-ink bg-white"
          >
            {kit.image_url && <img src={kit.image_url} alt={kit.name} className="max-h-80 w-full object-cover" />}
            <div className="p-6">
              <p className="font-label text-sm uppercase tracking-wide text-ink/50">kit {i + 1}</p>
              <h3 className="font-hand text-3xl font-bold">{kit.name}</h3>
              <div className="mt-3">
                <Markdown className="prose text-ink/80">{kit.description}</Markdown>
              </div>
              <div className="mt-4 rounded-xl bg-lilac/40 p-4">
                <p className="font-label text-sm uppercase tracking-wide text-ink/60">purpose</p>
                <Markdown className="prose text-ink/80">{kit.purpose}</Markdown>
              </div>
              {kit.video_url && (
                <a
                  href={kit.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="wobble-hover mt-4 inline-block font-label underline"
                >
                  ▶ watch this build on YouTube →
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      {!loading && !kits?.length && (
        <p className="mt-10 text-center font-label text-ink/60">kits are still being drafted — come back soon!</p>
      )}
    </section>
  );
}
