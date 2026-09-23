import { useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import ThoughtOfDayWidget from './components/ThoughtOfDayWidget';
import SwipeArrows from './components/SwipeArrows';
import { useSwipeNavigate } from './hooks/useSwipeNavigate';
import { PAGE_ORDER } from './pageOrder';
import Landing from './pages/Landing';
import Achievements from './pages/Achievements';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Books from './pages/Books';
import SkateForward from './pages/SkateForward';
import NotFound from './pages/NotFound';

const slideVariants = {
  enter: (direction) => ({ x: direction >= 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction >= 0 ? -60 : 60, opacity: 0 }),
};

// Figures out whether the new route is "forward" or "backward" of the old one along
// PAGE_ORDER, purely from render info (no effect/tick lag), so the slide direction of a
// page transition always matches the swipe/arrow/nav-link that triggered it.
function useTransitionDirection(pathname) {
  const prevPathRef = useRef(pathname);
  const directionRef = useRef(1);

  if (pathname !== prevPathRef.current) {
    const prevIndex = PAGE_ORDER.indexOf(prevPathRef.current);
    const nextIndex = PAGE_ORDER.indexOf(pathname);
    if (prevIndex !== -1 && nextIndex !== -1) {
      directionRef.current = nextIndex >= prevIndex ? 1 : -1;
    }
    prevPathRef.current = pathname;
  }

  return directionRef.current;
}

function AnimatedRoutes({ onDragEnd }) {
  const location = useLocation();
  const direction = useTransitionDirection(location.pathname);

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        dragMomentum={false}
        onDragEnd={onDragEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/books" element={<Books />} />
          <Route path="/skate-forward" element={<SkateForward />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { hasPrev, hasNext, goPrev, goNext, handleDragEnd } = useSwipeNavigate();

  return (
    <SmoothScroll>
      <Navbar />
      <main className="min-h-screen overflow-x-hidden">
        <AnimatedRoutes onDragEnd={handleDragEnd} />
      </main>
      <SwipeArrows hasPrev={hasPrev} hasNext={hasNext} goPrev={goPrev} goNext={goNext} />
      <ThoughtOfDayWidget />
    </SmoothScroll>
  );
}
