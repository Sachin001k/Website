import { useState } from 'react';
import Markdown from '../components/Markdown';
import { adminApi } from '../lib/api';

const inputClass =
  'w-full rounded-lg border-2 border-ink/30 bg-white px-3 py-2 font-body text-base focus:border-purple focus:outline-none';

const MAX_IMAGE_SIDE = 1800;

// Downscales big photos in the browser before upload so they stay well under the API's
// body-size limit (and load fast on the site). GIFs/SVGs are sent untouched.
async function prepareImage(file) {
  const passthrough = ['image/gif', 'image/svg+xml'].includes(file.type);
  if (passthrough) return { contentType: file.type, data: await toBase64(file) };

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const contentType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, contentType, 0.85));
  return { contentType, data: await toBase64(blob) };
}

function toBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function ImageUploader({ token, onUploaded, label = 'upload image' }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { contentType, data } = await prepareImage(file);
      const { url } = await adminApi.upload(token, { filename: file.name, contentType, data });
      onUploaded(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col">
      <label className="wobble-hover inline-block rounded-full border-2 border-ink bg-baby-blue px-3 py-1 font-label text-sm">
        {busy ? 'uploading…' : label}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={busy} />
      </label>
      {error && <span className="mt-1 font-label text-sm text-red-600">{error}</span>}
    </span>
  );
}

export default function Field({ field, value, onChange, token }) {
  const [preview, setPreview] = useState(false);
  const id = `field-${field.name}`;

  let input;
  switch (field.type) {
    case 'textarea':
      input = <textarea id={id} rows={3} className={inputClass} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'markdown':
      input = (
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="rounded-full border-2 border-ink/40 px-3 py-0.5 font-label text-sm"
            >
              {preview ? 'edit' : 'preview'}
            </button>
            <ImageUploader
              token={token}
              label="insert image"
              onUploaded={(url) =>
                onChange(`${value || ''}\n\n![describe the image here](${url} "caption here")\n`)
              }
            />
          </div>
          {preview ? (
            <div className="min-h-40 rounded-lg border-2 border-dashed border-ink/30 bg-white p-4">
              <Markdown>{value}</Markdown>
            </div>
          ) : (
            <textarea
              id={id}
              rows={12}
              className={`${inputClass} font-mono text-sm`}
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </div>
      );
      break;
    case 'number':
      input = (
        <input
          id={id}
          type="number"
          step={field.step ?? 1}
          min={field.min}
          max={field.max}
          className={inputClass}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case 'date':
      input = (
        <input
          id={id}
          type="date"
          className={inputClass}
          value={(value || '').slice(0, 10)}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case 'select':
      input = (
        <div className="flex flex-wrap gap-2">
          <select id={id} className={`${inputClass} w-auto`} value={field.options.includes(value) ? value : ''} onChange={(e) => onChange(e.target.value)}>
            <option value="">— none —</option>
            {field.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {field.allowCustom && (
            <input
              aria-label={`${field.label} (emoji)`}
              placeholder="or an emoji"
              className={`${inputClass} w-32`}
              value={field.options.includes(value) ? '' : value ?? ''}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </div>
      );
      break;
    case 'tags':
      input = (
        <input
          id={id}
          className={inputClass}
          value={Array.isArray(value) ? value.join(', ') : value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case 'image':
      input = (
        <div className="flex flex-wrap items-center gap-3">
          {value && <img src={value} alt="" className="h-20 w-20 rounded border-2 border-ink/20 object-cover" />}
          <input
            id={id}
            type="url"
            placeholder="https://… or upload →"
            className={`${inputClass} min-w-0 flex-1`}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
          <ImageUploader token={token} onUploaded={onChange} />
        </div>
      );
      break;
    default:
      input = (
        <input
          id={id}
          type={field.type === 'url' ? 'url' : 'text'}
          className={inputClass}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-label text-base">
        {field.label}
        {field.required && <span className="text-purple"> *</span>}
      </label>
      {input}
      {field.help && <p className="mt-1 font-label text-sm text-ink/50">{field.help}</p>}
    </div>
  );
}
