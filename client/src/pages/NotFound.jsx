import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-6xl">🧭</span>
      <h1 className="font-hand text-5xl font-bold gradient-text">page not found</h1>
      <p className="font-label text-lg text-ink/70">looks like this doodle wandered off the page.</p>
      <Link to="/" className="wobble-hover doodle-shadow rounded-full border-2 border-ink bg-white px-5 py-2 font-label">
        back home
      </Link>
    </section>
  );
}
