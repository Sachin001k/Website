import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';

export default function ThoughtOfDayWidget() {
  const [open, setOpen] = useState(true);
  const { data: thought } = useApiData(() => api.getLatestThought(), []);

  if (!thought) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-[260px] font-label">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="doodle-shadow relative rounded-md bg-sunshine p-4 text-ink"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-ink text-paper"
              aria-label="Dismiss thought of the day"
            >
              ×
            </button>
            <p className="text-sm uppercase tracking-wide opacity-70">thought of the week</p>
            <p className="mt-1 text-lg leading-snug">{thought.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="wobble-hover rounded-full bg-sunshine px-4 py-2 doodle-shadow"
        >
          💭
        </button>
      )}
    </div>
  );
}
