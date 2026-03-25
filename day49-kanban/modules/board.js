// modules/board.js
// Pure rendering — builds DOM from data. No state mutations here.

const COLUMNS = [
  { id: 'backlog',    label: 'Backlog',     color: 'var(--col-backlog)' },
  { id: 'todo',       label: 'To Do',       color: 'var(--col-todo)' },
  { id: 'inprogress', label: 'In Progress', color: 'var(--col-inprogress)' },
  { id: 'done',       label: 'Done',        color: 'var(--col-done)' },
];

export function renderBoard(tasks, { onDelete, onEdit, onDrop }) {
  const board = document.getElementById('board');
  board.innerHTML = '';

  COLUMNS.forEach(col => {
    const colTasks = tasks.filter(t => t.column === col.id);
    const colEl = buildColumn(col, colTasks, { onDelete, onEdit, onDrop });
    board.appendChild(colEl);
  });
}

function buildColumn(col, tasks, callbacks) {
  const el = document.createElement('div');
  el.className = 'column';
  el.dataset.column = col.id;

  el.innerHTML = `
    <div class="col-header">
      <div class="col-title">
        <span class="col-dot" style="background:${col.color}"></span>
        ${col.label}
      </div>
      <span class="col-count">${tasks.length}</span>
    </div>
    <div class="col-body" id="col-body-${col.id}"></div>
  `;

  const body = el.querySelector(`#col-body-${col.id}`);

  if (tasks.length === 0) {
    body.innerHTML = `<div class="empty-state">Drop tasks here</div>`;
  } else {
    tasks.forEach(task => {
      const card = buildCard(task, callbacks);
      body.appendChild(card);
    });
  }

  // ─── Drag-over events ─────────────────────────────────────
  el.addEventListener('dragover', e => {
    e.preventDefault();
    el.classList.add('drag-over');
  });
  el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
  el.addEventListener('drop', e => {
    e.preventDefault();
    el.classList.remove('drag-over');
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) callbacks.onDrop(taskId, col.id);
  });

  return el;
}

function buildCard(task, { onDelete, onEdit }) {
  const el = document.createElement('div');
  el.className = `card priority-${task.priority}`;
  el.draggable = true;
  el.dataset.id = task._id;

  const dateStr = formatDate(task.createdAt);
  const tagsHtml = (task.tags || [])
    .slice(0, 3)
    .map(t => `<span class="tag">${escHtml(t)}</span>`)
    .join('');

  el.innerHTML = `
    <div class="card-priority-bar"></div>
    <div class="card-top">
      <span class="card-title">${escHtml(task.title)}</span>
      <div class="card-actions">
        <button class="card-btn edit" title="Edit">✎</button>
        <button class="card-btn del" title="Delete">✕</button>
      </div>
    </div>
    ${task.description ? `<p class="card-desc">${escHtml(task.description)}</p>` : ''}
    <div class="card-footer">
      <div class="tags">${tagsHtml}</div>
      <span class="card-meta">${dateStr}</span>
    </div>
  `;

  // ─── Drag events ──────────────────────────────────────────
  el.addEventListener('dragstart', e => {
    el.classList.add('dragging');
    e.dataTransfer.setData('text/plain', task._id);
  });
  el.addEventListener('dragend', () => el.classList.remove('dragging'));

  // ─── Button events ────────────────────────────────────────
  el.querySelector('.edit').addEventListener('click', e => {
    e.stopPropagation();
    onEdit(task);
  });
  el.querySelector('.del').addEventListener('click', e => {
    e.stopPropagation();
    onDelete(task._id);
  });

  return el;
}

export function updateStats({ total, done, pct }) {
  document.getElementById('total-tasks').textContent = total;
  document.getElementById('done-tasks').textContent = done;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  document.getElementById('progress-pct').textContent = `${pct}%`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}