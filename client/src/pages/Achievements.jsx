import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';

// Rows arrive sorted by year (newest first) then sort_order; bucket them by year in that order.
function groupByYear(achievements) {
  const groups = [];
  for (const a of achievements) {
    const last = groups[groups.length - 1];
    if (last && last.year === a.year) last.items.push(a);
    else groups.push({ year: a.year, items: [a] });
  }
  return groups;
}

export default function Achievements() {
  const { data: achievements, loading } = useApiData(() => api.getAchievements(), []);
  const years = groupByYear(achievements || []);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <PageHeader title="What I’m Good At" subtitle="a timeline of the things I’ve worked hard at — scroll through the years." />

      {loading && <p className="mt-10 text-center font-label">unrolling the timeline...</p>}

      <div className="relative mt-16">
        {/* the hand-drawn spine of the timeline */}
        <div className="absolute bottom-0 left-[27px] top-0 w-1 rounded-full border-l-4 border-dashed border-ink/25 md:left-1/2 md:-translate-x-1/2" />

        {years.map((group, gi) => (
          <div key={group.year} className="relative mb-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
              className="relative z-10 mb-8 flex md:justify-center"
            >
              <span
                className="gradient-bg doodle-shadow rounded-full border-2 border-ink px-4 py-1 font-hand text-3xl font-bold"
                style={{ rotate: gi % 2 ? '3deg' : '-3deg' }}
              >
                {group.year}
              </span>
            </motion.div>

            <ol className="space-y-8">
              {group.items.map((a, i) => {
                const right = i % 2 === 1;
                return (
                  <motion.li
                    key={a.id}
                    initial={{ opacity: 0, x: right ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5 }}
                    className={`relative pl-16 md:w-1/2 md:pl-0 ${right ? 'md:ml-auto md:pl-10' : 'md:pr-10'}`}
                  >
                    <span
                      className={`absolute left-[19px] top-5 h-5 w-5 rounded-full border-2 border-ink bg-lilac md:top-5 ${
                        right ? 'md:-left-2.5' : 'md:-right-2.5 md:left-auto'
                      }`}
                    />
                    <div className="doodle-shadow rounded-xl border-2 border-ink bg-white p-4">
                      <div className="flex items-start gap-3">
                        {a.icon_url && <img src={a.icon_url} alt="" className="h-10 w-10 shrink-0 object-contain" />}
                        <div>
                          <h2 className="font-hand text-2xl font-bold leading-tight">{a.title}</h2>
                          {a.description && <p className="mt-1 font-body text-ink/80">{a.description}</p>}
                          {a.category && a.category !== 'general' && (
                            <span className="mt-2 inline-block rounded-full bg-baby-blue/60 px-2 py-0.5 font-label text-xs">
                              #{a.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>

      {!loading && !achievements?.length && (
        <p className="mt-10 text-center font-label text-ink/60">achievements coming soon!</p>
      )}
    </section>
  );
}
