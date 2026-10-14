import { useEffect, useState } from 'react';
import ResourceEditor from '../admin/ResourceEditor';
import SettingsEditor from '../admin/SettingsEditor';
import { RESOURCES } from '../admin/adminConfig';
import { adminApi } from '../lib/api';

const TOKEN_KEY = 'tvisha-admin-token';
const SETTINGS_TAB = 'settings';

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}
function writeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // private mode etc. — the session still works, it just won't be remembered
  }
}

// Content editor for Tvisha. Unlisted (not in the nav); every write is checked server-side
// against ADMIN_TOKEN, so this page is only a convenience UI over the API.
export default function Admin() {
  const [token, setToken] = useState(readToken);
  const [verified, setVerified] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(SETTINGS_TAB);

  useEffect(() => {
    if (!token) return;
    adminApi
      .check(token)
      .then(() => setVerified(true))
      .catch(() => {
        writeToken('');
        setToken('');
        setError('That password didn’t work.');
      });
  }, [token]);

  function login(e) {
    e.preventDefault();
    setError(null);
    writeToken(draft.trim());
    setToken(draft.trim());
  }

  function logout() {
    writeToken('');
    setToken('');
    setVerified(false);
  }

  if (!token || !verified) {
    return (
      <section className="mx-auto max-w-sm px-6 py-24">
        <form onSubmit={login} className="doodle-shadow space-y-4 rounded-2xl border-2 border-ink bg-white p-6">
          <h1 className="font-hand text-4xl font-bold gradient-text">admin</h1>
          <label htmlFor="admin-token" className="block font-label">
            Admin password
          </label>
          <input
            id="admin-token"
            type="password"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-lg border-2 border-ink/30 px-3 py-2 focus:border-purple focus:outline-none"
          />
          {error && <p className="font-label text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={!draft.trim() || (token && !verified)}
            className="wobble-hover gradient-bg rounded-full border-2 border-ink px-6 py-2 font-label text-lg disabled:opacity-50"
          >
            {token && !verified ? 'checking…' : 'let me in'}
          </button>
        </form>
      </section>
    );
  }

  const tabs = [{ key: SETTINGS_TAB, label: 'Page text & links' }, ...RESOURCES];
  const resource = RESOURCES.find((r) => r.key === tab);

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-hand text-5xl font-bold gradient-text">admin</h1>
        <button onClick={logout} className="font-label underline">
          log out
        </button>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[220px_1fr]">
        <nav className="flex flex-wrap gap-2 md:flex-col">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-xl border-2 px-3 py-2 text-left font-label ${
                tab === t.key ? 'border-ink bg-lilac' : 'border-ink/20 bg-white hover:border-ink/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="doodle-shadow min-w-0 rounded-2xl border-2 border-ink bg-paper p-5 md:p-6">
          {resource ? <ResourceEditor key={resource.key} resource={resource} token={token} /> : <SettingsEditor token={token} />}
        </div>
      </div>
    </section>
  );
}
