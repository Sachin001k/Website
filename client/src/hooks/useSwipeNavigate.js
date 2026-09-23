import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PAGE_ORDER } from '../pageOrder';

const SWIPE_DISTANCE = 45;
const SWIPE_VELOCITY = 350;

// Elements that handle their own drag (the landing page's doodle stickers) opt out of
// triggering page navigation by carrying this attribute.
const IGNORE_SELECTOR = '[data-swipe-ignore]';

// Drives page-to-page navigation for the top-level pages in PAGE_ORDER: touch swipe / mouse
// drag (via the returned handleDragEnd, meant for a Framer Motion `drag="x"` component) and
// left/right arrow keys, plus the state needed to render prev/next affordances.
export function useSwipeNavigate() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentIndex = PAGE_ORDER.indexOf(pathname);

  const goTo = useCallback(
    (delta) => {
      if (currentIndex === -1) return;
      const nextIndex = currentIndex + delta;
      if (nextIndex < 0 || nextIndex >= PAGE_ORDER.length) return;
      navigate(PAGE_ORDER[nextIndex]);
    },
    [currentIndex, navigate]
  );

  const goNext = useCallback(() => goTo(1), [goTo]);
  const goPrev = useCallback(() => goTo(-1), [goTo]);

  const handleDragEnd = useCallback(
    (event, info) => {
      if (event.target?.closest?.(IGNORE_SELECTOR)) return;

      const { x: dx, y: dy } = info.offset;
      if (Math.abs(dx) < Math.abs(dy)) return; // more vertical than horizontal: let it scroll
      if (Math.abs(dx) < SWIPE_DISTANCE && Math.abs(info.velocity.x) < SWIPE_VELOCITY) return;

      goTo(dx < 0 ? 1 : -1); // swipe left -> next page, swipe right -> previous page
    },
    [goTo]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  return {
    currentIndex,
    hasPrev: currentIndex > 0,
    hasNext: currentIndex !== -1 && currentIndex < PAGE_ORDER.length - 1,
    goNext,
    goPrev,
    handleDragEnd,
  };
}
