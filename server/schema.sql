-- Run this in the Supabase SQL editor (or `supabase db push`) for the Tvisha portfolio site.
-- The Node/Express server talks to these tables with the service-role key, so no
-- Row Level Security policies are required for the app to function; RLS is left enabled
-- with no policies so the anon key cannot read/write anything on its own.

create extension if not exists "pgcrypto";

-- 1. "What I Love" landing page — each row is one draggable bubble/sticker that opens a polaroid
create table if not exists bio_polaroids (
  id uuid primary key default gen_random_uuid(),
  label text not null,               -- word on the bubble, e.g. "speed skating"
  doodle text,                       -- built-in doodle key (skate | maths | reading | linguistics | travel) or an emoji
  image_url text,                    -- polaroid photo
  image_credit text,                 -- shown under the photo when it isn't Tvisha's own
  sentence text not null,            -- the bio sentence on the polaroid
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Thought of the day/week -----------------------------------------------------
create table if not exists thoughts (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  week_of date not null default current_date,
  created_at timestamptz not null default now()
);

-- 3. "What I'm Good At" — timeline grouped by year ---------------------------------
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  title text not null,
  description text,
  category text not null default 'general', -- e.g. skating, maths, linguistics, general
  icon_url text,
  sort_order int not null default 0,        -- order within a year
  created_at timestamptz not null default now()
);

-- 4. "The Metrics of Motion" blog posts (Markdown + LaTeX) -------------------------
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  cover_image_url text,
  content_md text not null default '',
  external_url text,                 -- set to link the card straight out to Medium instead
  tags text[] not null default '{}',
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 5. "Reading" — books ---------------------------------------------------------------
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  cover_image_url text,
  description text,
  rating numeric(2,1) check (rating >= 0 and rating <= 5),
  date_read date,
  created_at timestamptz not null default now()
);

-- 6. ReUP physics kits ------------------------------------------------------------------
create table if not exists reup_kits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  description text not null,         -- Markdown (+ LaTeX) — explain the kit in detail
  purpose text not null,             -- Markdown — what it teaches and why
  video_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 7. Travel — places visited ------------------------------------------------------------
create table if not exists travel_places (
  id uuid primary key default gen_random_uuid(),
  name text not null,                -- city / place
  country text,
  flag text,                         -- flag emoji, e.g. 🇯🇵
  image_url text,                    -- monument / place photo
  note text,
  year int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 8. Single-value site copy editable from /admin (intros, hero photo, external links) ---
create table if not exists site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table bio_polaroids enable row level security;
alter table thoughts enable row level security;
alter table achievements enable row level security;
alter table blog_posts enable row level security;
alter table books enable row level security;
alter table reup_kits enable row level security;
alter table travel_places enable row level security;
alter table site_settings enable row level security;

-- Public image bucket used by the /admin uploader (the server also creates it on first
-- upload if it's missing, so this is just for completeness).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
