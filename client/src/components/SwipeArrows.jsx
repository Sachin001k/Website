// Desktop-only affordance: a slim invisible hover zone hugs each screen edge, and the arrow
// fades in only while the pointer is over it — otherwise the page reads exactly like a plain
// scrapbook page with nothing floating on top.
export default function SwipeArrows({ hasPrev, hasNext, goPrev, goNext }) {
  if (!hasPrev && !hasNext) return null;

  return (
    <>
      {hasPrev && (
        <div className="group fixed left-0 top-0 z-40 hidden h-full w-16 items-center justify-start md:flex">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous page"
            className="doodle-shadow ml-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-white font-hand text-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            ‹
          </button>
        </div>
      )}
      {hasNext && (
        <div className="group fixed right-0 top-0 z-40 hidden h-full w-16 items-center justify-end md:flex">
          <button
            type="button"
            onClick={goNext}
            aria-label="Next page"
            className="doodle-shadow mr-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-white font-hand text-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
