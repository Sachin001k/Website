# Tvisha Bajaj — Portfolio Website — Project Plan

## Vibe / Direction
A portfolio that reads like a **scrapbook / comic**, not a corporate site — closest reference is
[ncase.me/trust](https://ncase.me/trust/): hand-drawn doodles, playful motion, everything feels
touchable. Inspiration for "time flies" color psychology: the warm, saturated,
slightly-oversaturated gradient palette that Instagram Reels / TikTok use (hot pink → purple →
orange), because those hues read as energetic and rewarding rather than "professional/corporate
blue," which is exactly why we want it here.

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
  - `--paper: #FFF8EF` (scrapbook page background, warm off-white, subtle grain texture)
  - `--ink: #1F1533` (near-black plum for doodle linework / body text)
  - `--hot-pink: #FF2E7E`
  - `--violet: #8C4DFF`
  - `--tangerine: #FF9430`
  - `--sunshine: #FFD23F`
  - `--sky: #3EC6FF`
  - Primary CTAs and highlights use a pink → violet → tangerine gradient (the "reels" gradient).
- **Type**: `Caveat` / `Kalam` (handwritten, for headings + word-bubble text), `Patrick Hand` for
  UI labels, `Comic Neue` for long-form body copy (blog posts) — all via Google Fonts.
- **Cursor**: the normal system cursor — a custom cursor was tried and reverted because the
  visual lag made dragging the landing-page doodles feel imprecise; usability won over novelty.
- **Motion**: Lenis drives smooth/eased page scroll everywhere; Framer Motion drives doodle drag
  physics, hover wiggles, and page-transition/reveal animation. Nothing should feel like a static
  webpage — panels drift in, doodles wobble on hover, buttons squash slightly on click.
- **Page-to-page navigation**: the five top-level pages (`client/src/pageOrder.js`) form a
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

### 1. Landing Page (`/`)
- Full-bleed draggable collage of doodles/stickers (Framer Motion `drag`) scattered across a
  corkboard/scrapbook background — strings connecting some of them like the trust-game intro.
- Clicking (not dragging) a doodle opens a **polaroid modal**: a photo + one bio sentence,
  building up Tvisha's personality bit by bit as you click around. Data comes from the
  `bio_polaroids` table.
- Smooth inertia scroll transitions between the collage hero and lower sections (nav teasers into
  Achievements / Blog / Books / Skate Forward).
- Small persistent **"Thought of the day/week"** box pinned bottom-corner, pulling from the
  `thoughts` table, styled like a sticky note.

### 2. Achievements Page (`/achievements`)
- Video-game style progression: tiers/levels (e.g. Bronze → Silver → Gold → Legendary) rendered
  as a level path/map (like a Candy-Crush level map) users scroll up through.
- Each node = one achievement (title, description, icon, date, category) from the `achievements`
  table; locked nodes for future/aspirational goals are greyed out.
- Stretch: a simple customizable avatar strip (skating uniform / doing-math / etc. costume swap)
  using layered SVGs, driven by `achievement.category`.

### 3. Blog (`/blog`, `/blog/:slug`)
- Same scrapbook visual language, comic-style display font for headings, Comic Neue for body.
- Posts stored as Markdown (with LaTeX via `$...$` / `$$...$$`, rendered through
  `remark-math` + KaTeX) in the `blog_posts` table; supports images with caption + required
  alt text.

### 4. Books (`/books`)
- Grid of polaroid-style cards (cover photo, title, author, short description, rating) pulled
  from the `books` table — looks like a shelf of stuck-up photos rather than a plain list.

### 5. Skate Forward Project (`/skate-forward`)
- Introduction/mission blurb for the initiative.
- The plan: 2–3 physics kits, each with a dedicated section explaining the concept it teaches and
  its purpose, pulled from the `skate_forward_kits` table.
- Embedded links out to the YouTube channel for build/upload videos.

## Data Model (Supabase — see `server/schema.sql`)
- `bio_polaroids(id, image_url, sentence, sort_order)`
- `thoughts(id, body, week_of)`
- `achievements(id, title, description, tier, category, icon_url, unlocked_at, sort_order)`
- `blog_posts(id, slug, title, cover_image_url, content_md, tags, published_at)`
- `books(id, title, author, cover_image_url, description, rating, date_read)`
- `skate_forward_kits(id, name, description, purpose, video_url, sort_order)`

## Env Vars
- `server/.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN`, `PORT`
- `client/.env`: `VITE_API_BASE_URL` (points at the Express API; client never touches Supabase
  keys directly)

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
      the live project; run it in the Supabase SQL editor before the API returns real data
- [x] Global shell (fonts, cursor, scroll, nav)
- [x] Landing page (draggable doodle collage, polaroid bio modal, teaser cards)
- [x] Blog (list + post, Markdown + LaTeX + captioned images)
- [x] Books (polaroid-style grid)
- [x] Skate Forward (intro, kit list, YouTube links)
- [x] Achievements (level-map layout with tiers)
- [ ] Landing doodles are emoji placeholders — swap for real hand-drawn art
- [ ] Real content pass (bio polaroids, achievements, books, posts, kits) once Tvisha supplies it
- [ ] Responsive polish pass on small screens
