// modules/toast.js
// Framework-agnostic notification system

export const Toast = {
  show(message, type = 'info', duration = 2800) {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;

    const icon = { success: '✓', error: '✕', info: 'ℹ' }[type] || 'ℹ';
    el.innerHTML = `<span>${icon}</span><span>${message}</span>`;

    container.appendChild(el);

    setTimeout(() => {
      el.style.animation = 'toastOut 0.25s ease forwards';
      setTimeout(() => el.remove(), 260);
    }, duration);
  },

  success: (msg) => Toast.show(msg, 'success'),
  error:   (msg) => Toast.show(msg, 'error'),
  info:    (msg) => Toast.show(msg, 'info'),
};