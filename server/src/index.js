import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { supabase } from './supabaseClient.js';
import { makeResourceRouter } from './routes/makeResourceRouter.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/bio-polaroids', makeResourceRouter({ table: 'bio_polaroids' }));
app.use('/api/achievements', makeResourceRouter({ table: 'achievements' }));
app.use('/api/books', makeResourceRouter({ table: 'books', orderBy: 'date_read', ascending: false }));
app.use('/api/blog', makeResourceRouter({ table: 'blog_posts', orderBy: 'published_at', ascending: false, slugColumn: 'slug' }));
app.use('/api/skate-forward', makeResourceRouter({ table: 'skate_forward_kits' }));
app.use('/api/thoughts', makeResourceRouter({ table: 'thoughts', orderBy: 'week_of', ascending: false }));

app.get('/api/thoughts/latest/current', async (req, res) => {
  const { data, error } = await supabase
    .from('thoughts')
    .select('*')
    .order('week_of', { ascending: false })
    .limit(1)
    .single();

  if (error) return res.status(404).json({ error: 'No thought posted yet' });
  res.json(data);
});

// Vercel imports this file as a serverless function (see /api/[...path].mjs) instead of
// running it directly, so only bind a real port when running locally / on a normal Node host.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Tvisha website API listening on http://localhost:${port}`));
}

export default app;
