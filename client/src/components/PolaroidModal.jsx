import { AnimatePresence, motion } from 'framer-motion';

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
            className="doodle-shadow w-72 bg-white p-4 pb-8"
            initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: -3, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-64 w-full items-center justify-center overflow-hidden bg-paper-dark">
              <img
                src={polaroid.image_url}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <p className="mt-4 text-center font-hand text-2xl text-ink">{polaroid.sentence}</p>
            <button
              onClick={onClose}
              className="wobble-hover mx-auto mt-3 block rounded-full bg-ink px-4 py-1 font-label text-sm text-paper"
            >
              close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
