import { Router } from 'express';
import { supabase } from '../supabaseClient.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

// Key/value site copy (page intros, hero photo, external links). GET returns a flat
// { key: value } object; PUT replaces any subset of keys in one go.
export const settingsRouter = Router();

settingsRouter.get('/', async (req, res) => {
  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error) return res.status(500).json({ error: error.message });
  res.json(Object.fromEntries(data.map((row) => [row.key, row.value])));
});

settingsRouter.put('/', requireAdmin, async (req, res) => {
  const rows = Object.entries(req.body || {}).map(([key, value]) => ({
    key,
    value: value ?? null,
    updated_at: new Date().toISOString(),
  }));
  if (!rows.length) return res.status(400).json({ error: 'Nothing to save' });

  const { error } = await supabase.from('site_settings').upsert(rows);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});
