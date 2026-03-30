const BASE = 'http://localhost:5001/api';

export const urlService = {
  async getAll() {
    const res = await fetch(`${BASE}/urls`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async create(payload) {
    const res = await fetch(`${BASE}/urls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async getAnalytics(id) {
    const res = await fetch(`${BASE}/urls/${id}/analytics`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async delete(id) {
    const res = await fetch(`${BASE}/urls/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data;
  },

  async toggle(id, isActive) {
    const res = await fetch(`${BASE}/urls/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }
};