# Tvisha Bajaj — Portfolio Website

A scrapbook/comic-style portfolio. See [`CLAUDE.md`](./CLAUDE.md) for the full design plan.

## One-time setup

1. **Install dependencies**
   ```bash
   npm install            # root (concurrently)
   npm run install:all    # client + server
   ```
2. **Create the database tables.** Open the Supabase SQL editor for this project
   (https://supabase.com/dashboard/project/crayzxjscbcivxrmezdb/sql) and run, in order:
   - `server/schema.sql` — creates all tables
   - `server/seed.sql` — optional placeholder content so pages aren't empty while you build

   Until this is run, the site will boot fine but API calls will return
   `Could not find the table ... in the schema cache` — that's expected.
3. Env files are already in place (`server/.env`, `client/.env`) with the Supabase keys you
   provided. `server/.env` holds the service-role key (never exposed to the browser); the client
   only talks to the Express API.

## Running it

```bash
npm run dev
```
This starts the Express API on `http://localhost:4000` and the Vite dev server on
`http://localhost:5173` (which proxies `/api/*` to the server). Open the client URL in your
browser.

## Adding real content

For now, content is added directly in Supabase (Table Editor) or via the API's admin routes:
`POST/PUT/DELETE` on `/api/<resource>` require an `Authorization: Bearer <ADMIN_TOKEN>` header,
where `ADMIN_TOKEN` is set in `server/.env`. Resources: `bio-polaroids`, `achievements`, `books`,
`blog` (has a `slug`), `skate-forward`, `thoughts`.

Replace the emoji placeholder "doodles" on the landing page
([`client/src/pages/Landing.jsx`](./client/src/pages/Landing.jsx)) with real hand-drawn SVG/PNG
assets whenever those are ready — the drag/click interaction already works with any image src.

## Deploying to Vercel

This repo deploys as a single Vercel project: the client builds to static files, and the Express
API runs as one serverless function (`api/[...path].mjs`) — see `vercel.json` and the
"Deployment" section of [`CLAUDE.md`](./CLAUDE.md) for how that's wired.

1. Push this repo to GitHub (if it isn't already) and import it in the Vercel dashboard
   ("Add New... → Project"). Vercel will read `vercel.json` automatically — no framework preset
   or root directory override needed.
2. In the new project's **Settings → Environment Variables**, add:
   - `SUPABASE_URL` — `https://crayzxjscbcivxrmezdb.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` — the value from `server/.env`
   - `ADMIN_TOKEN` — the value from `server/.env`
   Leave `VITE_API_BASE_URL` unset (it defaults to `/api`, same-origin with the deployed site).
3. Deploy. Once it's live, run `server/schema.sql` (and optionally `seed.sql`) in the Supabase SQL
   editor if you haven't already — same one-time step as local dev.
4. Every push to the connected branch redeploys automatically; `vercel --prod` from the CLI works
   too if you'd rather deploy manually.
