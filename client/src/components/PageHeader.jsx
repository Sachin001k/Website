import { motion } from 'framer-motion';

// Page title in the hand-drawn gradient font, with the subtitle in a comic word bubble.
export default function PageHeader({ title, subtitle, children }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="font-hand text-5xl font-bold gradient-text md:text-7xl">{title}</h1>
      {subtitle && (
        <p className="speech-bubble doodle-shadow mx-auto mt-5 max-w-xl font-label text-lg text-ink/80">
          {subtitle}
        </p>
      )}
      {children}
    </motion.header>
  );
}
