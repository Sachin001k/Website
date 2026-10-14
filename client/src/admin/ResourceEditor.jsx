import { useCallback, useEffect, useState } from 'react';
import Field from './Field';
import { adminApi } from '../lib/api';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function blankRow(fields) {
  return Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ? f.defaultValue() : '']));
}

// Turns form strings back into what the table columns expect; returns { row } or { error }.
function toRow(resource, form) {
  const row = {};
  for (const field of resource.fields) {
    let v = form[field.name];
    if (typeof v === 'string') v = v.trim();
    const empty = v === '' || v == null || (Array.isArray(v) && !v.length);

    if (empty && field.required) return { error: `“${field.label}” is required` };

    if (field.type === 'tags') {
      v = Array.isArray(v) ? v : (v || '').split(',').map((t) => t.trim()).filter(Boolean);
    } else if (empty) {
      v = field.emptyValue ?? (field.type === 'markdown' ? '' : null);
    } else if (field.type === 'number') {
      v = Number(v);
      if (Number.isNaN(v)) return { error: `“${field.label}” must be a number` };
    }
    row[field.name] = v;
  }
  if (resource.key === 'blog' && !row.slug) row.slug = slugify(row.title);
  return { row };
}

export default function ResourceEditor({ resource, token }) {
  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null); // null | { id?, form }
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  // The parent keys this component by resource, so switching tabs remounts with fresh state.
  const load = useCallback(() => {
    adminApi
      .list(resource.key)
      .then(setRows)
      .catch((err) => setStatus({ error: err.message }));
  }, [resource.key]);

  useEffect(load, [load]);

  async function save(e) {
    e.preventDefault();
    const { row, error } = toRow(resource, editing.form);
    if (error) return setStatus({ error });

    setSaving(true);
    setStatus(null);
    try {
      if (editing.id) await adminApi.update(token, resource.key, editing.id, row);
      else await adminApi.create(token, resource.key, row);
      setEditing(null);
      setStatus({ ok: 'Saved ✓' });
      load();
    } catch (err) {
      setStatus({ error: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm('Delete this for good?')) return;
    setSaving(true);
    try {
      await adminApi.remove(token, resource.key, editing.id);
      setEditing(null);
      setStatus({ ok: 'Deleted' });
      load();
    } catch (err) {
      setStatus({ error: err.message });
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <form onSubmit={save} className="space-y-5">
        <button type="button" onClick={() => setEditing(null)} className="font-label underline">
          ← back to the list
        </button>
        <h2 className="font-hand text-3xl font-bold">{editing.id ? 'Edit' : 'New'}</h2>
        {resource.fields.map((field) => (
          <Field
            key={field.name}
            field={field}
            token={token}
            value={editing.form[field.name]}
            onChange={(v) => setEditing((cur) => ({ ...cur, form: { ...cur.form, [field.name]: v } }))}
          />
        ))}
        {status?.error && <p className="font-label text-red-600">{status.error}</p>}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="wobble-hover gradient-bg rounded-full border-2 border-ink px-6 py-2 font-label text-lg disabled:opacity-50"
          >
            {saving ? 'saving…' : 'save'}
          </button>
          {editing.id && (
            <button
              type="button"
              onClick={remove}
              disabled={saving}
              className="rounded-full border-2 border-red-600 px-4 py-2 font-label text-red-600 disabled:opacity-50"
            >
              delete
            </button>
          )}
        </div>
      </form>
    );
  }

  return (
    <div>
      {resource.help && <p className="mb-4 font-label text-ink/60">{resource.help}</p>}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing({ form: blankRow(resource.fields) })}
          className="wobble-hover gradient-bg rounded-full border-2 border-ink px-4 py-1 font-label text-lg"
        >
          + add new
        </button>
        {status?.ok && <span className="font-label text-green-700">{status.ok}</span>}
        {status?.error && <span className="font-label text-red-600">{status.error}</span>}
      </div>

      {!rows && !status?.error && <p className="font-label">loading…</p>}
      {rows && !rows.length && <p className="font-label text-ink/60">Nothing here yet.</p>}
      <ul className="space-y-2">
        {(rows || []).map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => setEditing({ id: r.id, form: { ...blankRow(resource.fields), ...r } })}
              className="flex w-full items-baseline justify-between gap-4 rounded-xl border-2 border-ink/20 bg-white px-4 py-3 text-left hover:border-purple"
            >
              <span className="truncate font-body font-bold">{resource.title(r) || '(untitled)'}</span>
              <span className="shrink-0 truncate font-label text-sm text-ink/50">{resource.subtitle?.(r)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
