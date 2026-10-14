import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DoodleSticker from '../components/DoodleSticker';
import PolaroidModal from '../components/PolaroidModal';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';
import { PAGES } from '../pageOrder';

// Shown until the bio_polaroids table has rows, so the collage is never empty.
const FALLBACK_BUBBLES = [
  { id: 'skate', label: 'speed skating', doodle: 'skate', sentence: 'Inline speed skating — on eight wheels, not a skateboard!' },
  { id: 'maths', label: 'maths', doodle: 'maths', image_url: '/doodles/maths.svg', sentence: 'Give me a blackboard full of equations.' },
  { id: 'reading', label: 'reading', doodle: 'reading', sentence: 'There’s always a book in my bag.' },
  {
    id: 'linguistics',
    label: 'linguistics',
    doodle: 'linguistics',
    image_url: '/photos/linguistics.webp',
    image_credit: 'Photo: Churchill College, University of Cambridge',
    sentence: 'I love figuring out how languages work.',
  },
  { id: 'travel', label: 'travel', doodle: 'travel', sentence: 'Every trip is a new page in the scrapbook.' },
];

const POSITIONS = [
  { top: '8%', left: '6%' },
  { top: '14%', left: '74%' },
  { top: '62%', left: '8%' },
  { top: '66%', left: '70%' },
  { top: '74%', left: '40%' },
  { top: '6%', left: '42%' },
  { top: '40%', left: '84%' },
  { top: '38%', left: '2%' },
];

const TEASERS = {
  '/what-im-good-at': { doodle: '🏆', blurb: 'a timeline of wins, year by year.' },
  '/travel': { doodle: '🗺️', blurb: 'places I’ve been, pinned to the page.' },
  '/blog': { doodle: '📈', blurb: 'using physics to analyse speed skating.' },
  '/reading': { doodle: '📚', blurb: 'every book I’ve read and loved.' },
  '/reup': { doodle: '🔧', blurb: 'hands-on physics kits.' },
};

export default function Landing() {
  const { data: polaroids, loading } = useApiData(() => api.getBioPolaroids(), []);
  const [activePolaroid, setActivePolaroid] = useState(null);

  const bubbles = loading ? [] : polaroids?.length ? polaroids : FALLBACK_BUBBLES;

  return (
    <>
      <section className="relative min-h-[88vh] w-full overflow-hidden px-6">
        <div className="pointer-events-none relative z-0 flex min-h-[88vh] flex-col items-center justify-center gap-5 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-label text-lg uppercase tracking-[0.2em] text-ink/50"
          >
            what i love
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-hand text-6xl font-bold gradient-text md:text-8xl"
          >
            Hi, I’m Tvisha
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="speech-bubble doodle-shadow max-w-md font-label text-xl text-ink/80"
          >
            drag the stickers around, or click one to learn a little about me :)
          </motion.p>
        </div>

        {bubbles.map((bubble, i) => (
          <DoodleSticker
            key={bubble.id || i}
            doodle={bubble.doodle}
            label={bubble.label}
            rotate={((i % 5) - 2) * 5}
            style={{ ...POSITIONS[i % POSITIONS.length], zIndex: 10 }}
            onOpen={() => setActivePolaroid(bubble)}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
        {PAGES.filter((page) => TEASERS[page.path]).map((page, i) => (
          <motion.div
            key={page.path}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              to={page.path}
              className="wobble-hover doodle-shadow flex h-full flex-col gap-2 rounded-2xl border-2 border-ink bg-white p-5"
            >
              <span className="text-4xl">{TEASERS[page.path].doodle}</span>
              <span className="font-hand text-2xl font-bold">{page.label}</span>
              <span className="font-body text-sm text-ink/70">{TEASERS[page.path].blurb}</span>
            </Link>
          </motion.div>
        ))}
      </section>

      <PolaroidModal polaroid={activePolaroid} onClose={() => setActivePolaroid(null)} />
    </>
  );
}
