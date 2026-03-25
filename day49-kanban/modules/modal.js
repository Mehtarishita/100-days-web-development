// modules/modal.js
// Encapsulates all modal open/close/form logic — like a React controlled component

export const Modal = {
  _onSave: null,
  _editingId: null,

  init() {
    document.getElementById('modal-close').addEventListener('click', () => this.close());
    document.getElementById('btn-cancel').addEventListener('click', () => this.close());
    document.getElementById('btn-open-modal').addEventListener('click', () => this.openNew());
    document.getElementById('btn-save-task').addEventListener('click', () => this._handleSave());

    document.getElementById('modal-overlay').addEventListener('click', e => {
      if (e.target === document.getElementById('modal-overlay')) this.close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
    });
  },

  onSave(fn) {
    this._onSave = fn;
  },

  openNew(defaultColumn = 'todo') {
    this._editingId = null;
    this._reset();
    document.getElementById('task-column').value = defaultColumn;
    document.getElementById('modal-title').textContent = 'New Task';
    document.getElementById('btn-save-task').textContent = 'Save Task';
    this._show();
  },

  openEdit(task) {
    this._editingId = task._id;
    document.getElementById('modal-title').textContent = 'Edit Task';
    document.getElementById('btn-save-task').textContent = 'Update Task';
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.description || '';
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-column').value = task.column;
    document.getElementById('task-tags').value = (task.tags || []).join(', ');
    this._show();
  },

  close() {
    document.getElementById('modal-overlay').classList.add('hidden');
    this._editingId = null;
  },

  _show() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    setTimeout(() => document.getElementById('task-title').focus(), 50);
  },

  _reset() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-priority').value = 'medium';
    document.getElementById('task-column').value = 'todo';
    document.getElementById('task-tags').value = '';
  },

  _handleSave() {
    const title = document.getElementById('task-title').value.trim();
    if (!title) {
      document.getElementById('task-title').focus();
      document.getElementById('task-title').style.borderColor = 'var(--danger)';
      setTimeout(() => {
        document.getElementById('task-title').style.borderColor = '';
      }, 1200);
      return;
    }

    const data = {
      title,
      description: document.getElementById('task-desc').value.trim(),
      priority: document.getElementById('task-priority').value,
      column: document.getElementById('task-column').value,
      tags: document.getElementById('task-tags').value
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      _id: this._editingId,
    };

    if (this._onSave) this._onSave(data);
    this.close();
  }
};