const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getBioPolaroids: () => request('/bio-polaroids'),
  getAchievements: () => request('/achievements'),
  getBooks: () => request('/books'),
  getBlogPosts: () => request('/blog'),
  getBlogPost: (slug) => request(`/blog/${slug}`),
  getSkateForwardKits: () => request('/skate-forward'),
  getLatestThought: () => request('/thoughts/latest/current'),
};
