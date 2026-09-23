import { useEffect } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

// Wraps the whole app in an inertia/eased scroll so navigating the site feels
// like flipping through a scrapbook rather than a stock webpage.
export default function SmoothScroll({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    let raf;
    const raf_loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(raf_loop);
    };
    raf = requestAnimationFrame(raf_loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
}
