import { useApiData } from './useApiData';
import { api } from '../lib/api';

// Site-wide editable copy (page intros, hero photo, external links) from site_settings.
// Falls back to an empty object so pages can use `settings.foo || 'default'`.
export function useSettings() {
  const { data } = useApiData(() => api.getSettings(), []);
  return data || {};
}
