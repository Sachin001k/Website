import { Router } from 'express';
import { supabase } from '../supabaseClient.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

/**
 * Builds a standard read-public / write-admin REST router over one Supabase table.
 * `slugColumn` lets a resource also be fetched by a human-readable slug (e.g. blog posts).
 */
export function makeResourceRouter({ table, orderBy = 'sort_order', ascending = true, slugColumn }) {
  const router = Router();

  router.get('/', async (req, res) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(orderBy, { ascending });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  if (slugColumn) {
    router.get(`/:${slugColumn}`, async (req, res) => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(slugColumn, req.params[slugColumn])
        .single();

      if (error) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    });
  } else {
    router.get('/:id', async (req, res) => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    });
  }

  router.post('/', requireAdmin, async (req, res) => {
    const { data, error } = await supabase.from(table).insert(req.body).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  });

  router.put('/:id', requireAdmin, async (req, res) => {
    const { data, error } = await supabase
      .from(table)
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  router.delete('/:id', requireAdmin, async (req, res) => {
    const { error } = await supabase.from(table).delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).end();
  });

  return router;
}
