import { DOODLE_NAMES } from '../components/Doodle';

// What /admin can edit. Each resource maps to an Express route under /api and lists the
// form fields shown for one row. Field types: text, textarea, markdown, number, date,
// image, url, select, tags.
export const RESOURCES = [
  {
    key: 'bio-polaroids',
    label: 'What I Love (bubbles)',
    help: 'Each row is one draggable bubble on the landing page; clicking it opens the polaroid.',
    title: (r) => r.label,
    subtitle: (r) => r.sentence,
    fields: [
      { name: 'label', label: 'Bubble word', type: 'text', required: true },
      {
        name: 'doodle',
        label: 'Doodle',
        type: 'select',
        options: DOODLE_NAMES,
        help: 'Pick a built-in doodle, or leave blank and type an emoji below.',
        allowCustom: true,
      },
      { name: 'image_url', label: 'Polaroid photo', type: 'image' },
      { name: 'image_credit', label: 'Photo credit (if not yours)', type: 'text' },
      { name: 'sentence', label: 'Bio sentence', type: 'textarea', required: true },
      { name: 'sort_order', label: 'Order', type: 'number', emptyValue: 0 },
    ],
  },
  {
    key: 'thoughts',
    label: 'Thought of the day/week',
    help: 'The newest one (by date) is shown on the landing page.',
    title: (r) => r.body,
    subtitle: (r) => r.week_of,
    fields: [
      { name: 'body', label: 'Thought', type: 'textarea', required: true },
      { name: 'week_of', label: 'Date', type: 'date', required: true, defaultValue: () => today() },
    ],
  },
  {
    key: 'achievements',
    label: 'What I’m Good At',
    help: 'Grouped by year on the timeline, newest year first.',
    title: (r) => r.title,
    subtitle: (r) => r.year,
    fields: [
      { name: 'year', label: 'Year', type: 'number', required: true, defaultValue: () => new Date().getFullYear() },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'text', help: 'e.g. skating, maths, linguistics', defaultValue: () => 'general', emptyValue: 'general' },
      { name: 'icon_url', label: 'Icon / badge image', type: 'image' },
      { name: 'sort_order', label: 'Order within the year', type: 'number', emptyValue: 0 },
    ],
  },
  {
    key: 'travel-places',
    label: 'Travel',
    help: 'Places on the travel page. The big photo at the top is under Page text & links.',
    title: (r) => `${r.flag || ''} ${r.name}`,
    subtitle: (r) => [r.country, r.year].filter(Boolean).join(' · '),
    fields: [
      { name: 'name', label: 'Place', type: 'text', required: true },
      { name: 'country', label: 'Country', type: 'text' },
      { name: 'flag', label: 'Flag emoji', type: 'text', help: 'e.g. 🇯🇵 🇫🇷 🇮🇳' },
      { name: 'image_url', label: 'Monument / place photo', type: 'image' },
      { name: 'note', label: 'Note', type: 'textarea' },
      { name: 'year', label: 'Year visited', type: 'number' },
      { name: 'sort_order', label: 'Order', type: 'number', emptyValue: 0 },
    ],
  },
  {
    key: 'blog',
    label: 'The Metrics of Motion (blog)',
    help: 'Write the post here, or just paste a Medium link in "External link" to send readers there.',
    title: (r) => r.title,
    subtitle: (r) => (r.published_at || '').slice(0, 10),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'URL slug', type: 'text', help: 'Leave blank to make one from the title.' },
      { name: 'summary', label: 'Short summary', type: 'textarea' },
      { name: 'cover_image_url', label: 'Cover image', type: 'image' },
      { name: 'external_url', label: 'External link (e.g. Medium article)', type: 'url' },
      {
        name: 'content_md',
        label: 'Post',
        type: 'markdown',
        help: 'Markdown. Maths: $v = d/t$ inline or $$...$$ on its own line. Images: ![alt text](url "caption") — use the image uploader below to get a URL.',
      },
      { name: 'tags', label: 'Tags', type: 'tags', help: 'Comma separated.' },
      { name: 'published_at', label: 'Publish date', type: 'date', defaultValue: () => today() },
    ],
  },
  {
    key: 'books',
    label: 'Reading',
    title: (r) => r.title,
    subtitle: (r) => r.author,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'author', label: 'Author', type: 'text', required: true },
      { name: 'cover_image_url', label: 'Cover', type: 'image' },
      { name: 'description', label: 'Description / review', type: 'textarea' },
      { name: 'rating', label: 'Rating (0–5)', type: 'number', step: 0.5, min: 0, max: 5 },
      { name: 'date_read', label: 'Date read', type: 'date' },
    ],
  },
  {
    key: 'reup-kits',
    label: 'ReUP kits',
    help: 'The intro and YouTube channel link are under Page text & links.',
    title: (r) => r.name,
    subtitle: (r) => `#${r.sort_order ?? ''}`,
    fields: [
      { name: 'name', label: 'Kit name', type: 'text', required: true },
      { name: 'image_url', label: 'Photo', type: 'image' },
      { name: 'description', label: 'What it is (detail)', type: 'markdown', required: true },
      { name: 'purpose', label: 'Purpose / what it teaches', type: 'markdown', required: true },
      { name: 'video_url', label: 'YouTube video', type: 'url' },
      { name: 'sort_order', label: 'Order', type: 'number', emptyValue: 0 },
    ],
  },
];

// Single values stored in site_settings.
export const SETTINGS_FIELDS = [
  { name: 'thought_label', label: 'Thought box heading', type: 'text', help: 'e.g. "thought of the day" or "thought of the week"' },
  { name: 'travel_hero_image', label: 'Travel page — big photo', type: 'image' },
  { name: 'travel_intro', label: 'Travel page — intro line', type: 'text' },
  { name: 'medium_url', label: 'Medium profile link', type: 'url' },
  { name: 'reup_intro', label: 'ReUP — introduction', type: 'markdown' },
  { name: 'reup_youtube_url', label: 'ReUP — YouTube channel link', type: 'url' },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}
