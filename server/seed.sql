-- Starter content so pages aren't empty. Everything here is editable from /admin —
-- replace the placeholder sentences/achievements/books with Tvisha's real text.

insert into thoughts (body, week_of) values
  ('Progress > perfection. Ship the scrappy version first.', current_date);

insert into bio_polaroids (label, doodle, image_url, image_credit, sentence, sort_order) values
  ('speed skating', 'skate', null, null, 'I race on inline speed skates (not a skateboard!) — and I like measuring exactly how fast.', 1),
  ('maths', 'maths', '/doodles/maths.svg', null, 'Give me a blackboard full of equations and I''m happy for hours.', 2),
  ('reading', 'reading', null, null, 'There''s always a book in my bag.', 3),
  ('linguistics', 'linguistics', '/photos/linguistics.webp', 'Photo: Churchill College, University of Cambridge', 'I''m fascinated by how languages work under the hood.', 4),
  ('travel', 'travel', null, null, 'I collect places — every trip is a new page in the scrapbook.', 5);

insert into achievements (year, title, description, category, sort_order) values
  (2026, 'Placeholder achievement', 'Replace me from /admin with the real text.', 'general', 1);

insert into books (title, author, description, rating, date_read) values
  ('The Feynman Lectures on Physics', 'Richard Feynman', 'The book that made physics feel like play instead of homework.', 5, current_date);

insert into reup_kits (name, description, purpose, video_url, sort_order) values
  ('Kit 1 (placeholder)', 'Describe the kit, what''s in the box and how it''s built.', 'What physics concept it teaches and why it matters.', null, 1),
  ('Kit 2 (placeholder)', 'Describe the kit, what''s in the box and how it''s built.', 'What physics concept it teaches and why it matters.', null, 2);

insert into blog_posts (slug, title, summary, content_md, tags) values (
  'hello-world',
  'Hello, World!',
  'Why I''m using physics to pick apart speed skating.',
  E'# Hello, World!\n\nThis blog is about using physics to analyse speed skating — like $F = ma$ on eight wheels.',
  array['intro']
);

insert into site_settings (key, value) values
  ('thought_label', 'thought of the week'),
  ('medium_url', 'https://medium.com/@cece_11925'),
  ('reup_intro', 'An introduction to ReUP is coming soon — edit this from /admin.'),
  ('reup_youtube_url', ''),
  ('travel_hero_image', ''),
  ('travel_intro', 'Places I''ve been, pinned to the page.')
on conflict (key) do nothing;
