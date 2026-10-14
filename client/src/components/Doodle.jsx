// Small hand-drawn-style SVG doodles for the "What I Love" bubbles. `name` matches the
// bio_polaroids.doodle column; anything unknown is rendered as text (so an emoji works too).
const stroke = {
  fill: 'none',
  stroke: 'var(--ink)',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const DOODLES = {
  // Inline speed skate: low-cut boot on a long frame with four wheels in a row.
  skate: (
    <>
      <path
        d="M22 18 C21 30 20 40 19 50 C30 52 46 52 62 54 C70 55 76 58 78 63 L18 64 C15 60 15 54 19 50"
        fill="var(--baby-blue)"
        {...stroke}
      />
      <path d="M22 18 C28 16 34 17 38 19 L37 34" {...stroke} />
      <path d="M26 30 L35 28 M25 38 L36 36" {...stroke} strokeWidth={2} />
      <path d="M14 67 L84 67" {...stroke} />
      {[22, 38, 54, 70].map((cx) => (
        <circle key={cx} cx={cx} cy={76} r={7} fill="var(--lilac)" {...stroke} />
      ))}
      <path d="M4 40 L11 40 M2 48 L10 48 M6 56 L12 56" {...stroke} strokeWidth={2} />
    </>
  ),
  maths: (
    <>
      <rect x="8" y="12" width="80" height="58" rx="4" fill="#2f4858" {...stroke} />
      <path d="M8 70 L88 70" {...stroke} strokeWidth={5} />
      <path d="M28 70 L22 88 M68 70 L74 88" {...stroke} />
      <g fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round">
        <path d="M17 26 C19 22 23 22 24 26 C25 30 22 34 17 36 L25 36" />
        <path d="M30 29 L36 29 M30 33 L36 33" />
        <path d="M41 24 L41 37 M47 24 C52 24 52 30 47 30 L41 30" />
        <path d="M17 50 L23 50 M20 47 L20 53" />
        <path d="M30 46 C34 44 34 56 38 54 M28 51 L40 50" />
        <path d="M56 45 L60 55 L66 40 L80 40" />
        <path d="M68 48 L72 52 M72 48 L68 52" />
      </g>
      <path d="M60 22 L80 22 M62 28 L76 28" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
    </>
  ),
  reading: (
    <>
      <path d="M48 26 C36 18 22 18 10 22 L10 74 C22 70 36 70 48 78 Z" fill="#fff" {...stroke} />
      <path d="M48 26 C60 18 74 18 86 22 L86 74 C74 70 60 70 48 78 Z" fill="var(--lilac)" {...stroke} />
      <path d="M18 34 C26 32 34 32 40 35 M18 44 C26 42 34 42 40 45 M18 54 C26 52 34 52 40 55" {...stroke} strokeWidth={2} />
      <path d="M70 18 L70 40 L75 35 L80 40 L80 19" fill="var(--blue)" {...stroke} strokeWidth={2} />
    </>
  ),
  linguistics: (
    <>
      <path d="M8 14 L56 14 C60 14 62 16 62 20 L62 44 C62 48 60 50 56 50 L26 50 L16 60 L18 50 L14 50 C10 50 8 48 8 44 Z" fill="#fff" {...stroke} />
      <text x="35" y="40" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="26" fontWeight="700" fill="var(--ink)">
        Aa
      </text>
      <path d="M40 46 L84 46 C88 46 90 48 90 52 L90 74 C90 78 88 80 84 80 L80 80 L82 90 L70 80 L44 80 C40 80 38 78 38 74 L38 52 C38 48 40 46 44 46 Z" fill="var(--baby-blue)" {...stroke} />
      <text x="64" y="72" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="24" fontWeight="700" fill="var(--ink)">
        ¿ñ?
      </text>
    </>
  ),
  travel: (
    <>
      <circle cx="44" cy="50" r="32" fill="var(--baby-blue)" {...stroke} />
      <path d="M24 34 C30 30 36 36 34 42 C32 48 38 52 36 60 M52 22 C56 30 50 34 56 40 C62 46 70 42 74 48 M50 82 C50 74 56 72 60 66" {...stroke} strokeWidth={2.2} />
      <path d="M62 16 L92 8 L80 30 L74 24 Z" fill="#fff" {...stroke} strokeWidth={2.4} />
      <path d="M74 24 L92 8" {...stroke} strokeWidth={2} />
      <path d="M60 18 C52 14 44 16 38 20" {...stroke} strokeWidth={2} strokeDasharray="4 5" />
    </>
  ),
};

export const DOODLE_NAMES = Object.keys(DOODLES);

export default function Doodle({ name, className = 'h-20 w-20' }) {
  const doodle = DOODLES[name];
  if (!doodle) {
    return <span className="text-5xl leading-none md:text-6xl">{name || '✨'}</span>;
  }
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      {doodle}
    </svg>
  );
}
