import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DoodleSticker from '../components/DoodleSticker';
import PolaroidModal from '../components/PolaroidModal';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';

const FALLBACK_EMOJIS = ['🛹', '📐', '✨', '📓', '🌈', '🎧', '🧠', '🍕', '🎨', '⭐️'];

const TEASERS = [
  { to: '/achievements', title: 'achievements', blurb: 'level up through the wins, one badge at a time.', emoji: '🏆' },
  { to: '/blog', title: 'blog', blurb: 'notes, half-formed ideas, and the occasional equation.', emoji: '📝' },
  { to: '/books', title: 'books', blurb: 'a shelf of everything worth reading twice.', emoji: '📚' },
  { to: '/skate-forward', title: 'skate forward', blurb: 'physics kits built on a skateboard.', emoji: '🛼' },
];

export default function Landing() {
  const { data: polaroids } = useApiData(() => api.getBioPolaroids(), []);
  const [activePolaroid, setActivePolaroid] = useState(null);

  const stickers = (polaroids && polaroids.length ? polaroids : []).map((p, i) => ({
    ...p,
    emoji: FALLBACK_EMOJIS[i % FALLBACK_EMOJIS.length],
  }));

  const positions = [
    { top: '12%', left: '8%' }, { top: '22%', left: '78%' }, { top: '55%', left: '15%' },
    { top: '68%', left: '68%' }, { top: '38%', left: '45%' }, { top: '80%', left: '35%' },
    { top: '15%', left: '50%' }, { top: '60%', left: '85%' },
  ];

  return (
    <>
      <section className="relative min-h-[85vh] w-full overflow-hidden px-6">
        {stickers.map((sticker, i) => (
          <DoodleSticker
            key={sticker.id || i}
            emoji={sticker.emoji}
            rotate={((i % 5) - 2) * 6}
            style={positions[i % positions.length]}
            onOpen={() => setActivePolaroid(sticker)}
          />
        ))}

        <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center gap-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-hand text-6xl font-bold gradient-text md:text-8xl"
          >
            hi, i'm tvisha!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-md font-label text-xl text-ink/80"
          >
            drag the stickers around, or click one to learn a little about me.
          </motion.p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {TEASERS.map((teaser, i) => (
          <motion.div
            key={teaser.to}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              to={teaser.to}
              className="wobble-hover doodle-shadow flex h-full flex-col gap-2 rounded-2xl border-2 border-ink bg-white p-5"
            >
              <span className="text-4xl">{teaser.emoji}</span>
              <span className="font-hand text-2xl font-bold">{teaser.title}</span>
              <span className="font-body text-sm text-ink/70">{teaser.blurb}</span>
            </Link>
          </motion.div>
        ))}
      </section>

      <PolaroidModal polaroid={activePolaroid} onClose={() => setActivePolaroid(null)} />
    </>
  );
}
