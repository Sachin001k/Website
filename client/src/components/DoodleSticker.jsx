import { useRef } from 'react';
import { motion } from 'framer-motion';
import Doodle from './Doodle';

// A draggable scrapbook sticker: a doodle with its word in a little comic bubble. Dragging
// moves it around the corkboard; a genuine click (no drag movement in between) opens the
// polaroid bio modal.
export default function DoodleSticker({ doodle, label, style, rotate = 0, onOpen }) {
  const dragged = useRef(false);

  return (
    <motion.button
      type="button"
      data-swipe-ignore
      aria-label={label ? `${label} — open polaroid` : 'open polaroid'}
      className="wobble-hover doodle-shadow absolute flex cursor-grab select-none flex-col items-center gap-1 bg-transparent active:cursor-grabbing"
      style={style}
      drag
      dragMomentum={false}
      dragElastic={0.15}
      initial={{ rotate }}
      whileTap={{ scale: 0.95 }}
      onDragStart={() => {
        dragged.current = false;
      }}
      onDrag={() => {
        dragged.current = true;
      }}
      onClick={() => {
        if (!dragged.current) onOpen();
      }}
    >
      <Doodle name={doodle} className="pointer-events-none h-16 w-16 md:h-24 md:w-24" />
      {label && (
        <span className="pointer-events-none rounded-full border-2 border-ink bg-white px-3 py-0.5 font-hand text-xl font-bold leading-tight md:text-2xl">
          {label}
        </span>
      )}
    </motion.button>
  );
}
