import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import Doodle from '../components/Doodle';
import { useApiData } from '../hooks/useApiData';
import { useSettings } from '../hooks/useSettings';
import { api } from '../lib/api';

export default function Travel() {
  const settings = useSettings();
  const { data: places, loading } = useApiData(() => api.getTravelPlaces(), []);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <PageHeader title="Travel" subtitle={settings.travel_intro || 'places I’ve been, pinned to the page.'} />

      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="doodle-shadow relative mx-auto mt-14 bg-white p-3 pb-10 md:p-4 md:pb-12"
      >
        <span className="tape" aria-hidden="true" />
        <div className="gradient-bg flex aspect-[16/9] w-full items-center justify-center overflow-hidden">
          {settings.travel_hero_image ? (
            <img src={settings.travel_hero_image} alt="A favourite travel photo" className="h-full w-full object-cover" />
          ) : (
            <Doodle name="travel" className="h-32 w-32 opacity-70" />
          )}
        </div>
      </motion.div>

      {loading && <p className="mt-10 text-center font-label">unfolding the map...</p>}

      <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
        {(places || []).map((place, i) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, rotate: (i % 2 === 0 ? -1 : 1) * (1 + (i % 3)) }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
            className="wobble-hover doodle-shadow bg-white p-3 pb-4"
          >
            <div className="flex aspect-square items-center justify-center overflow-hidden bg-paper-dark">
              {place.image_url ? (
                <img src={place.image_url} alt={place.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-6xl">{place.flag || '📍'}</span>
              )}
            </div>
            <h2 className="mt-3 font-hand text-2xl font-bold leading-tight">
              {place.image_url && place.flag ? `${place.flag} ` : ''}
              {place.name}
            </h2>
            {(place.country || place.year) && (
              <p className="font-label text-sm text-ink/60">
                {[place.country, place.year].filter(Boolean).join(' · ')}
              </p>
            )}
            {place.note && <p className="mt-1 font-body text-xs text-ink/70">{place.note}</p>}
          </motion.div>
        ))}
      </div>

      {!loading && !places?.length && (
        <p className="mt-10 text-center font-label text-ink/60">the map is still being filled in!</p>
      )}
    </section>
  );
}
