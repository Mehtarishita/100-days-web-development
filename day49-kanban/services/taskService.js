// services/taskService.js

const BASE_URL = 'http://localhost:3000/api/tasks';

export const TaskService = {

  _tasks: [],

  // ── Init ────────────────────────────────────────────────
  async init() {
    this._tasks = await this.readTasks();
    return this._tasks;
  },

  // ── Read ────────────────────────────────────────────────
  async readTasks() {
    const res  = await fetch(BASE_URL);
    const json = await res.json();
    this._tasks = json.data;
    return this._tasks;
  },

  // ── Create ──────────────────────────────────────────────
  async createTask(data) {
    const res  = await fetch(BASE_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    this._tasks.unshift(json.data);
    return json.data;
  },

  // ── Update ──────────────────────────────────────────────
  async updateTask(id, patch) {
    const res  = await fetch(`${BASE_URL}/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(patch)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    const index = this._tasks.findIndex(t => t._id === id);
    if (index !== -1) this._tasks[index] = json.data;
    return json.data;
  },

  // ── Delete ──────────────────────────────────────────────
  async deleteTask(id) {
    const res  = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    this._tasks = this._tasks.filter(t => t._id !== id);
    return true;
  },

  // ── Helpers ─────────────────────────────────────────────
  getAll() {
    return this._tasks;
  },

  getStats() {
    const total = this._tasks.length;
    const done  = this._tasks.filter(t => t.column === 'done').length;
    const pct   = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }

};