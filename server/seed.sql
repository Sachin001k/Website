-- Placeholder content so pages aren't empty during development.
-- Replace/delete these rows once real content is entered.

insert into thoughts (body, week_of) values
  ('Progress > perfection. Ship the scrappy version first.', current_date);

insert into bio_polaroids (image_url, sentence, sort_order) values
  ('/placeholders/polaroid-1.jpg', 'Hi, I''m Tvisha — this is my corner of the internet.', 1),
  ('/placeholders/polaroid-2.jpg', 'I skate, I build, and I love a good physics problem.', 2),
  ('/placeholders/polaroid-3.jpg', 'Currently obsessed with making the internet feel personal again.', 3);

insert into achievements (title, description, tier, category, unlocked_at, sort_order) values
  ('First Kickflip', 'Landed my first kickflip after weeks of bruises.', 'bronze', 'skating', current_date, 1),
  ('Math Olympiad Qualifier', 'Qualified for the regional math olympiad.', 'silver', 'math', current_date, 2),
  ('Launched Skate Forward', 'Shipped the first Skate Forward physics kit.', 'gold', 'general', current_date, 3);

insert into books (title, author, description, rating, date_read) values
  ('The Feynman Lectures on Physics', 'Richard Feynman', 'The book that made physics feel like play instead of homework.', 5, current_date);

insert into skate_forward_kits (name, description, purpose, video_url, sort_order) values
  ('Kit 1: Rolling Motion', 'A build that turns a skateboard into a rolling-motion physics demo.', 'Teaches velocity, acceleration, and friction hands-on.', 'https://youtube.com/@your-channel', 1),
  ('Kit 2: Ramps & Energy', 'A modular ramp kit for exploring potential vs. kinetic energy.', 'Teaches energy conservation through real skate tricks.', 'https://youtube.com/@your-channel', 2);

insert into blog_posts (slug, title, content_md, tags) values (
  'hello-world',
  'Hello, World!',
  '# Hello, World!\n\nThis is the first post on my scrapbook of a website. More soon — including some math, like $E = mc^2$.',
  array['intro']
);
