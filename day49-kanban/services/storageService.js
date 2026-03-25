// services/storageService.js
// Abstracts all persistence logic — swap for API calls later

const STORAGE_KEY = 'flowboard_tasks';

export const StorageService = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  save(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('[StorageService] Save failed:', err);
    }
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
};