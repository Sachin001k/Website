-- Run this in the Supabase SQL editor (or `supabase db push`) for the Tvisha portfolio site.
-- The Node/Express server talks to these tables with the service-role key, so no
-- Row Level Security policies are required for the app to function; RLS is left enabled
-- with no policies so the anon key (used only in the client for future direct reads,
-- if ever needed) cannot read/write anything on its own.

create extension if not exists "pgcrypto";

-- 1. Landing page bio polaroids -------------------------------------------------
create table if not exists bio_polaroids (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  sentence text not null,
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

-- 3. Achievements (video-game style level map) -----------------------------------
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tier text not null default 'bronze', -- bronze | silver | gold | legendary
  category text not null default 'general', -- e.g. skating, math, general
  icon_url text,
  unlocked_at date,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 4. Blog posts (Markdown + LaTeX) -----------------------------------------------
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  cover_image_url text,
  content_md text not null,
  tags text[] not null default '{}',
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 5. Books ------------------------------------------------------------------------
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

-- 6. Skate Forward project kits ----------------------------------------------------
create table if not exists skate_forward_kits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  purpose text not null,
  video_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table bio_polaroids enable row level security;
alter table thoughts enable row level security;
alter table achievements enable row level security;
alter table blog_posts enable row level security;
alter table books enable row level security;
alter table skate_forward_kits enable row level security;
