import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { supabase } from './supabaseClient.js';
import { makeResourceRouter } from './routes/makeResourceRouter.js';
import { settingsRouter } from './routes/settings.js';
import { uploadRouter } from './routes/upload.js';
import { requireAdmin } from './middleware/requireAdmin.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
// Image uploads arrive base64-encoded in JSON; the client downsizes them first so they stay
// under Vercel's ~4.5 MB request-body cap.
app.use(express.json({ limit: '6mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/admin/check', requireAdmin, (req, res) => res.json({ ok: true }));

app.use('/api/bio-polaroids', makeResourceRouter({ table: 'bio_polaroids' }));
app.use('/api/achievements', makeResourceRouter({ table: 'achievements', orderBy: 'year', ascending: false, thenBy: 'sort_order' }));
app.use('/api/books', makeResourceRouter({ table: 'books', orderBy: 'date_read', ascending: false }));
app.use('/api/blog', makeResourceRouter({ table: 'blog_posts', orderBy: 'published_at', ascending: false, slugColumn: 'slug' }));
app.use('/api/reup-kits', makeResourceRouter({ table: 'reup_kits' }));
app.use('/api/travel-places', makeResourceRouter({ table: 'travel_places' }));
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);

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
app.use('/api/thoughts', makeResourceRouter({ table: 'thoughts', orderBy: 'week_of', ascending: false }));

// Vercel imports this file as a serverless function (see /api/[...path].mjs) instead of
// running it directly, so only bind a real port when running locally / on a normal Node host.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Tvisha website API listening on http://localhost:${port}`));
}

export default app;
