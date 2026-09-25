// Vercel routes every /api/* request to this one catch-all function (the [...path] filename
// is Vercel's file-system convention for that), which just hands the request straight to the
// existing Express app — every route in server/src is already mounted under /api/..., which
// matches the path Vercel passes through untouched, so nothing else has to change.
import app from '../server/src/index.js';

export default function handler(req, res) {
  return app(req, res);
}
