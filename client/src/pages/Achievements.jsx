import { motion } from 'framer-motion';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';

const TIER_STYLES = {
  bronze: { bg: 'bg-tangerine', label: '🥉 bronze' },
  silver: { bg: 'bg-sky', label: '🥈 silver' },
  gold: { bg: 'bg-sunshine', label: '🥇 gold' },
  legendary: { bg: 'bg-hot-pink', label: '👑 legendary' },
};

export default function Achievements() {
  const { data: achievements, loading } = useApiData(() => api.getAchievements(), []);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-center font-hand text-5xl font-bold gradient-text md:text-6xl">
        the achievement map
      </h1>
      <p className="mt-3 text-center font-label text-lg text-ink/70">
        every badge is a level cleared — scroll up through the run.
      </p>

      {loading && <p className="mt-10 text-center font-label">loading the map...</p>}

      <ol className="relative mt-16 space-y-10 border-l-4 border-dashed border-ink/30 pl-8">
        {(achievements || []).map((a, i) => {
          const tier = TIER_STYLES[a.tier] || TIER_STYLES.bronze;
          return (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative"
            >
              <span
                className={`absolute -left-[42px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink font-label text-sm ${tier.bg}`}
              >
                {i + 1}
              </span>
              <div className="doodle-shadow rounded-xl border-2 border-ink bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-hand text-2xl font-bold">{a.title}</h2>
                  <span className={`rounded-full ${tier.bg} px-3 py-0.5 font-label text-xs`}>
                    {tier.label}
                  </span>
                </div>
                <p className="mt-1 font-body text-ink/80">{a.description}</p>
                {a.unlocked_at && (
                  <p className="mt-2 font-label text-xs uppercase tracking-wide text-ink/50">
                    unlocked {new Date(a.unlocked_at).toLocaleDateString()} · {a.category}
                  </p>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>

      {!loading && !achievements?.length && (
        <p className="mt-10 text-center font-label text-ink/60">
          no achievements logged yet — the first level is waiting to be cleared!
        </p>
      )}
    </section>
  );
}
