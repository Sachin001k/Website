const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const { token, ...rest } = options;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Request to ${path} failed: ${res.status}`);
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
  getReupKits: () => request('/reup-kits'),
  getTravelPlaces: () => request('/travel-places'),
  getSettings: () => request('/settings'),
  getLatestThought: () => request('/thoughts/latest/current'),
};

// Write calls for /admin. `resource` is the API path segment, e.g. 'books' or 'blog'.
export const adminApi = {
  check: (token) => request('/admin/check', { token }),
  list: (resource) => request(`/${resource}`),
  create: (token, resource, row) =>
    request(`/${resource}`, { token, method: 'POST', body: JSON.stringify(row) }),
  update: (token, resource, id, row) =>
    request(`/${resource}/${id}`, { token, method: 'PUT', body: JSON.stringify(row) }),
  remove: (token, resource, id) => request(`/${resource}/${id}`, { token, method: 'DELETE' }),
  saveSettings: (token, values) =>
    request('/settings', { token, method: 'PUT', body: JSON.stringify(values) }),
  upload: (token, file) =>
    request('/upload', { token, method: 'POST', body: JSON.stringify(file) }),
};
