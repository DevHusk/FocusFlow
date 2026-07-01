/**
 * Storage Service — Abstracted layer for persistence.
 * Currently uses localStorage; swap for Supabase/Firebase by
 * replacing these functions without touching the rest of the app.
 */

const PREFIX = 'focusflow_';

function getKey(key: string): string {
  return `${PREFIX}${key}`;
}

export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(getKey(key));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(getKey(key), JSON.stringify(value));
    } catch (e) {
      console.error('Storage write failed:', e);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(getKey(key));
  },

  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },

  exportAll(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => {
        try {
          data[k.replace(PREFIX, '')] = JSON.parse(localStorage.getItem(k) || 'null');
        } catch { /* skip */ }
      });
    return data;
  },

  importAll(data: Record<string, unknown>): void {
    Object.entries(data).forEach(([key, value]) => {
      storage.set(key, value);
    });
  },
};
