# Tvisha Bajaj — Portfolio Website — Project Plan

## Vibe / Direction
A portfolio that reads like a **scrapbook / comic**, not a corporate site — closest reference is
[ncase.me/trust](https://ncase.me/trust/): hand-drawn doodles, word-bubble text, playful motion,
everything feels touchable. Signature colour is a **light blue → light purple** gradient (Tvisha's
brief, Oct 2026 — replaced the earlier hot-pink/orange "reels" palette).

## Tech Stack
- **Frontend**: React 18 + Vite (JS, not TS — keep iteration fast), React Router, Tailwind CSS,
  Framer Motion (drag + reveal animation), Lenis (smooth/inertia scrolling), KaTeX (LaTeX
  rendering in blog posts).
- **Backend**: Node.js + Express. Wraps Supabase — the browser never sees the service-role key.
  Public `GET` routes are open; write routes (`POST`/`PUT`/`DELETE`) require a simple admin
  bearer-token check (`ADMIN_TOKEN` env var) since this is a single-author site.
- **Database**: Supabase Postgres (see `server/schema.sql` for table definitions). Images are
  stored in a Supabase Storage bucket (`media`) and referenced by URL.
- **Dev workflow**: one root `npm run dev` (via `concurrently`) boots both the Vite dev server
  (client, port 5173) and the Express API (server, port 4000). The client proxies `/api/*` to the
  server in dev.

## Directory Layout
```
Website/
  CLAUDE.md
  package.json          # root: concurrently runs client + server
  client/                # React app
  server/                # Express API + schema.sql
```

## Design System
- **Colors** (`client/src/index.css` custom properties):
  - `--paper: #FBFAFF`, `--paper-dark: #ECE8FB`, `--ink: #1F1533` (doodle linework / body text)
  - `--baby-blue: #B8E2FF`, `--lilac: #D9C9FF` — pale pair for fills/backgrounds (`.gradient-bg`)
  - `--blue: #4FA8EC`, `--purple: #9A78F0` — deeper pair for `.gradient-text` so headings stay legible
  - `--sunshine: #FFE27A` — sticky-note yellow only
  - Page background is a fixed light-blue → lilac wash with a dot grain.
  - Reusable bits: `.speech-bubble` (comic word bubble, used for page subtitles), `.tape` (washi tape).
- **Type**: `Caveat` / `Kalam` (handwritten, for headings + word-bubble text), `Patrick Hand` for
  UI labels, `Comic Neue` for long-form body copy (blog posts) — all via Google Fonts.
- **Cursor**: doodle arrow via CSS `cursor: url(/cursors/*.svg)` (`client/public/cursors/`). It's a
  native cursor image, not a JS-followed element — an earlier JS cursor was reverted because its lag
  made dragging the doodles feel imprecise, so never reintroduce a JS-driven cursor.
- **Motion**: Lenis drives smooth/eased page scroll everywhere; Framer Motion drives doodle drag
  physics, hover wiggles, and page-transition/reveal animation. Nothing should feel like a static
  webpage — panels drift in, doodles wobble on hover, buttons squash slightly on click.
- **Page-to-page navigation**: the six top-level pages (`client/src/pageOrder.js`) form a
  sequence you can move through by swiping left/right — a real `drag="x"` with elastic
  live-follow-the-finger feedback and a rubber-band snap back at the first/last page, like
  switching Home Screens on iOS — plus left/right arrow keys, hover-only edge arrows
  (`SwipeArrows.jsx`, appear only when the pointer is near the extreme left/right edge on
  desktop, hidden on touch since the gesture covers it), or the navbar. Every route change
  animates as a directional slide (`AnimatePresence` in `App.jsx`). Draggable doodle stickers
  opt out of the swipe gesture via a `data-swipe-ignore` attribute (belt-and-suspenders — Framer
  Motion doesn't propagate a nested drag to an ancestor drag component by default anyway) so
  dragging one around doesn't also flip the page.
- **Texture**: subtle paper-grain background, torn-edge / tape / polaroid-corner PNG/SVG assets
  reused across pages for the scrapbook feel.

## Pages & Features
Source brief: Google Doc "Tvisha Website - Portfolio Website" (tabs: Overall features, Text for
bubbles, Achievements, Book reviews, ReUP Project, Travel details). Swipe order / nav lives in
`client/src/pageOrder.js`. Old URLs `/achievements`, `/books`, `/skate-forward` redirect.

### 1. What I Love — landing (`/`)
- "Hi, I'm Tvisha" + bubble subtitle "drag the stickers around, or click one to learn a little
  about me :)". Draggable doodle bubbles from `bio_polaroids` (built-in SVG doodles in
  `components/Doodle.jsx`: skate = **inline speed skating, not skateboarding**, maths = blackboard,
  reading, linguistics, travel). Click → polaroid modal (photo + credit + bio sentence).
- Linguistics photo is from chu.cam.ac.uk (`public/photos/linguistics.webp`) — always show the
  credit "Photo: Churchill College, University of Cambridge".
- Thought of the day/week sticky note — landing only (rendered in `App.jsx`, since the page
  wrapper's transform would break `position: fixed`); heading text is a site setting.

### 2. What I'm Good At (`/what-im-good-at`)
- Scrollable vertical timeline grouped by `achievements.year` (newest first), alternating sides on
  desktop.

### 3. Travel (`/travel`)
- Big taped photo (`travel_hero_image` setting) + polaroid grid of `travel_places` (flag emoji or
  monument photo).

### 4. The Metrics of Motion — blog (`/blog`, `/blog/:slug`)
- Physics of speed skating. Markdown + LaTeX + captioned images (`components/Markdown.jsx`).
  A post with `external_url` links straight out to Medium. Medium profile button from settings.

### 5. Reading (`/reading`)
- Polaroid grid of `books` (cover, title, author, rating, description).

### 6. ReUP (`/reup`)
- Intro (Markdown, `reup_intro` setting) + YouTube channel link, then kit sections from
  `reup_kits` (description + purpose in Markdown, optional photo and video link).

### Admin (`/admin`, unlisted)
- Password = `ADMIN_TOKEN`; stored in localStorage and verified via `GET /api/admin/check`.
- Generic editor driven by `client/src/admin/adminConfig.js` (one entry per table + the
  `site_settings` fields). Image fields upload through `POST /api/upload` → Supabase Storage
  bucket `media` (auto-created); the browser downsizes photos to ≤1800px first to stay under
  Vercel's ~4.5 MB body cap.

## Data Model (Supabase — see `server/schema.sql`)
- `bio_polaroids(id, label, doodle, image_url, image_credit, sentence, sort_order)`
- `thoughts(id, body, week_of)`
- `achievements(id, year, title, description, category, icon_url, sort_order)`
- `blog_posts(id, slug, title, summary, cover_image_url, content_md, external_url, tags, published_at)`
- `books(id, title, author, cover_image_url, description, rating, date_read)`
- `reup_kits(id, name, image_url, description, purpose, video_url, sort_order)`
- `travel_places(id, name, country, flag, image_url, note, year, sort_order)`
- `site_settings(key, value)` — keys: `thought_label`, `travel_hero_image`, `travel_intro`,
  `medium_url`, `reup_intro`, `reup_youtube_url`

## Env Vars
- `server/.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN`, `PORT`
- `client/.env`: `VITE_API_BASE_URL` (points at the Express API; client never touches Supabase
  keys directly)

## Deployment (Vercel, single project)
- `api/[...path].mjs` is a catch-all Vercel serverless function that hands every `/api/*`
  request straight to the existing Express app (`server/src/index.js`, which now `export default
  app` and only calls `app.listen()` when `process.env.VERCEL` is unset). Every server route was
  already mounted under `/api/...`, matching the path Vercel passes through, so no route code
  changed.
- Root `vercel.json` builds the client (`npm run build --prefix client`) with output directory
  `client/dist`, and rewrites any non-`/api` path to `index.html` so React Router's client-side
  routes work on refresh/direct link.
- The client already defaults `VITE_API_BASE_URL` to `/api` when the env var isn't set
  (`client/src/lib/api.js`) — since client and API are served from the same Vercel domain in this
  setup, leave that env var unset in Vercel so requests stay same-origin (no CORS needed).
- **Required Vercel Environment Variables** (Project Settings → Environment Variables):
  `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN` — the same values as
  `server/.env`, which is git-ignored and never uploaded. Do **not** set `VITE_API_BASE_URL`.
- Verified locally end-to-end: built `api/[...path].mjs` with `VERCEL=1` set and the real
  Supabase env vars, pointed a plain Node http server at it, and confirmed `/api/health` and
  `/api/bio-polaroids` both routed correctly through the Express app.

## Build Order
1. Scaffold root + client (Vite/React/Tailwind) + server (Express), env files, `npm run dev`.
2. Supabase schema + seed script.
3. Global shell: fonts, color tokens, custom cursor, Lenis smooth scroll, nav.
4. Landing page collage + polaroid modal + thought-of-the-day box.
5. Blog (list + post + LaTeX/image support).
6. Books grid.
7. Skate Forward page.
8. Achievements level-map page.
9. Pass: responsive check, polish animations, seed real content with Tvisha.

## Status
- [x] Plan written
- [x] Scaffold (client/server/env/dev script) — `npm run dev` boots both, verified end-to-end
- [x] Supabase schema written (`server/schema.sql`, `server/seed.sql`) — **not yet run** against
      the live project (checked Oct 2026: no tables exist); run both in the Supabase SQL editor
- [x] Global shell (fonts, cursor, scroll, nav)
- [x] Landing page (draggable doodle collage, polaroid bio modal, teaser cards)
- [x] Blog (list + post, Markdown + LaTeX + captioned images)
- [x] Books (polaroid-style grid)
- [x] Skate Forward (intro, kit list, YouTube links)
- [x] Achievements (level-map layout with tiers)
- [x] Oct 2026 brief: renamed pages, light blue → purple palette, doodle cursor, word bubbles,
      year timeline, Travel page, ReUP page, Medium link, /admin editor with image upload
- [ ] Doodles are simple SVG stand-ins — swap for real hand-drawn art if Tvisha draws some
- [ ] Photos "in drive" (skating, reading, travel, travel hero) — not shared yet; upload via /admin
- [ ] Real content pass (bio polaroids, achievements, books, posts, kits) once Tvisha supplies it
- [ ] Responsive polish pass on small screens
