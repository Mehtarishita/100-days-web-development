// app.js

import { TaskService }              from './services/taskService.js';
import { renderBoard, updateStats } from './modules/board.js';
import { Modal }                    from './modules/modal.js';
import { Toast }                    from './modules/toast.js';

// ── 1. Boot ───────────────────────────────────────────────
async function init() {
  await TaskService.init();
  Modal.init();
  Modal.onSave(handleSave);
  render();
}

// ── 2. Render ─────────────────────────────────────────────
function render() {
  const tasks = TaskService.getAll();

  renderBoard(tasks, {
    onDelete: handleDelete,
    onEdit:   handleEditOpen,
    onDrop:   handleDrop,
  });

  updateStats(TaskService.getStats());
}

// ── 3. Handlers ───────────────────────────────────────────
async function handleSave(data) {
  try {
    if (data._id) {
      await TaskService.updateTask(data._id, data);
      Toast.success('Task updated');
    } else {
      await TaskService.createTask(data);
      Toast.success('Task created');
    }
    render();
  } catch (err) {
    Toast.error(err.message);
  }
}

async function handleDelete(id) {
  try {
    await TaskService.deleteTask(id);
    render();
    Toast.info('Task deleted');
  } catch (err) {
    Toast.error(err.message);
  }
}

function handleEditOpen(task) {
  Modal.openEdit(task);
}

async function handleDrop(taskId, targetColumn) {
  try {
    await TaskService.updateTask(taskId, { column: targetColumn });
    render();
  } catch (err) {
    Toast.error(err.message);
  }
}

// ── 4. Start ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);