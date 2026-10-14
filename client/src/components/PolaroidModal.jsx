import { AnimatePresence, motion } from 'framer-motion';
import Doodle from './Doodle';

export default function PolaroidModal({ polaroid, onClose }) {
  return (
    <AnimatePresence>
      {polaroid && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="doodle-shadow relative w-80 max-w-full bg-white p-4 pb-6"
            initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: -3, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={polaroid.label || 'polaroid'}
          >
            <span className="tape" aria-hidden="true" />
            <div className="gradient-bg flex aspect-square w-full items-center justify-center overflow-hidden">
              {polaroid.image_url ? (
                <img
                  src={polaroid.image_url}
                  alt={polaroid.label || ''}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-ink/60">
                  <Doodle name={polaroid.doodle} className="h-28 w-28" />
                  <span className="font-label text-sm">photo coming soon</span>
                </div>
              )}
            </div>
            {polaroid.image_credit && (
              <p className="mt-1 text-right font-label text-[11px] text-ink/50">{polaroid.image_credit}</p>
            )}
            {polaroid.label && (
              <p className="mt-2 text-center font-label text-sm uppercase tracking-wide text-ink/50">
                {polaroid.label}
              </p>
            )}
            <p className="mt-1 text-center font-hand text-2xl leading-tight text-ink">{polaroid.sentence}</p>
            <button
              onClick={onClose}
              className="wobble-hover mx-auto mt-4 block rounded-full bg-ink px-4 py-1 font-label text-sm text-paper"
            >
              close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
