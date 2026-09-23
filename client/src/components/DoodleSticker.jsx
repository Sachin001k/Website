import { useRef } from 'react';
import { motion } from 'framer-motion';

// A draggable scrapbook sticker. Dragging moves it around the corkboard;
// a genuine click (no drag movement in between) opens the polaroid bio modal.
export default function DoodleSticker({ emoji, style, rotate = 0, onOpen }) {
  const dragged = useRef(false);

  return (
    <motion.button
      type="button"
      data-swipe-ignore
      className="wobble-hover doodle-shadow absolute cursor-grab select-none bg-transparent text-5xl leading-none active:cursor-grabbing md:text-6xl"
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
      {emoji}
    </motion.button>
  );
}
