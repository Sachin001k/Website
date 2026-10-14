// Top-level pages, in the order swiping left/right (or the arrow buttons) moves through them.
// Sub-routes like /blog/:slug and /admin aren't part of the swipe sequence.
export const PAGES = [
  { path: '/', label: 'what i love' },
  { path: '/what-im-good-at', label: "what i'm good at" },
  { path: '/travel', label: 'travel' },
  { path: '/blog', label: 'the metrics of motion' },
  { path: '/reading', label: 'reading' },
  { path: '/reup', label: 'ReUP' },
];

export const PAGE_ORDER = PAGES.map((page) => page.path);
