import { useEffect, useState } from 'react';
import Field from './Field';
import { SETTINGS_FIELDS } from './adminConfig';
import { adminApi, api } from '../lib/api';

export default function SettingsEditor({ token }) {
  const [values, setValues] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getSettings()
      .then(setValues)
      .catch((err) => setStatus({ error: err.message }));
  }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const payload = Object.fromEntries(
        SETTINGS_FIELDS.map((f) => [f.name, (values[f.name] ?? '').trim() || null])
      );
      await adminApi.saveSettings(token, payload);
      setStatus({ ok: 'Saved ✓' });
    } catch (err) {
      setStatus({ error: err.message });
    } finally {
      setSaving(false);
    }
  }

  if (!values) return <p className="font-label">{status?.error || 'loading…'}</p>;

  return (
    <form onSubmit={save} className="space-y-5">
      <p className="font-label text-ink/60">One-off bits of text, photos and links used around the site.</p>
      {SETTINGS_FIELDS.map((field) => (
        <Field
          key={field.name}
          field={field}
          token={token}
          value={values[field.name]}
          onChange={(v) => setValues((cur) => ({ ...cur, [field.name]: v }))}
        />
      ))}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="wobble-hover gradient-bg rounded-full border-2 border-ink px-6 py-2 font-label text-lg disabled:opacity-50"
        >
          {saving ? 'saving…' : 'save'}
        </button>
        {status?.ok && <span className="font-label text-green-700">{status.ok}</span>}
        {status?.error && <span className="font-label text-red-600">{status.error}</span>}
      </div>
    </form>
  );
}
