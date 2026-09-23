import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { to: '/', label: 'home' },
  { to: '/achievements', label: 'achievements' },
  { to: '/blog', label: 'blog' },
  { to: '/books', label: 'books' },
  { to: '/skate-forward', label: 'skate forward' },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 bg-paper/90 px-5 py-3 shadow-sm backdrop-blur"
    >
      <NavLink to="/" className="font-hand text-3xl font-bold gradient-text">
        tvisha.bajaj
      </NavLink>
      <nav className="flex flex-wrap gap-1 font-label text-lg">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `wobble-hover relative rounded-full px-3 py-1 ${
                isActive ? 'text-paper' : 'hover:bg-sunshine/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                  />
                )}
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.header>
  );
}
