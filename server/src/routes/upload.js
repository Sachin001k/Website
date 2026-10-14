import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { supabase } from '../supabaseClient.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const BUCKET = 'media';
const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

let bucketReady = false;
async function ensureBucket() {
  if (bucketReady) return;
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error && !/already exists/i.test(error.message)) throw error;
  }
  bucketReady = true;
}

// POST { filename, contentType, data: <base64> } -> { url }
export const uploadRouter = Router();

uploadRouter.post('/', requireAdmin, async (req, res) => {
  const { filename = 'image', contentType, data } = req.body || {};
  const ext = EXTENSIONS[contentType];
  if (!ext || !data) return res.status(400).json({ error: 'Send a JPEG, PNG, WebP, GIF or SVG image' });

  try {
    await ensureBucket();
    const base = filename.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const path = `${new Date().toISOString().slice(0, 7)}/${base || 'image'}-${randomUUID().slice(0, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, Buffer.from(data, 'base64'), { contentType, upsert: false });
    if (error) throw error;

    const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);
    res.status(201).json({ url: publicUrl.publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});
