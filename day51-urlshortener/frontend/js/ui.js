import { toast } from './toast.js';
import { urlService } from './api.js';

let chartInstance = null;

// ---- Render links table ----
export function renderLinks(urls, query = '') {
  const body = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');

  const filtered = query
    ? urls.filter(u =>
        u.originalUrl.toLowerCase().includes(query.toLowerCase()) ||
        u.slug.toLowerCase().includes(query.toLowerCase()) ||
        (u.title || '').toLowerCase().includes(query.toLowerCase())
      )
    : urls;

  body.innerHTML = '';

  if (filtered.length === 0) {
    body.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⌁</div>
        <p>${query ? `No links matching "${query}"` : 'No links yet. Shorten your first URL above!'}</p>
      </div>`;
    return;
  }

  filtered.forEach(url => {
    const row = document.createElement('div');
    row.className = 'table-row';
    row.dataset.id = url._id;

    const createdAt = new Date(url.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const expiresHtml = getExpiresHtml(url.expiresAt);
    const shortUrl = `http://localhost:5001/${url.slug}`;

    row.innerHTML = `
      <div class="row-original">
        ${url.title ? `<span class="row-title">${escHtml(url.title)}</span>` : ''}
        <span title="${escHtml(url.originalUrl)}">${truncate(url.originalUrl, 55)}</span>
      </div>
      <div class="row-short">
        <a href="${shortUrl}" target="_blank">snip/${url.slug}</a>
      </div>
      <div class="row-clicks">
        <span class="click-badge">
          <svg viewBox="0 0 24 24" style="width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3"/></svg>
          ${url.totalClicks}
        </span>
      </div>
      <div class="row-date">${createdAt}</div>
      <div class="row-expires">${expiresHtml}</div>
      <div class="row-actions">
        <button class="action-btn copy-btn" title="Copy link" data-url="${shortUrl}">
          <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <button class="action-btn qr-btn" title="QR Code" data-id="${url._id}" data-qr="${url.qrCode}" data-slug="${url.slug}">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3z"/></svg>
        </button>
        <button class="action-btn analytics-btn" title="Analytics" data-id="${url._id}" data-slug="${url.slug}" data-title="${escHtml(url.title || url.slug)}">
          <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </button>
        <button class="action-btn danger delete-btn" title="Delete" data-id="${url._id}" data-slug="${url.slug}">
          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    `;

    // Copy
    row.querySelector('.copy-btn').addEventListener('click', (e) => {
      const u = e.currentTarget.dataset.url;
      navigator.clipboard.writeText(u).then(() => toast('Link copied!', 'success', 1500));
    });

    // QR
    row.querySelector('.qr-btn').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      showQrModal(btn.dataset.qr, `http://localhost:5001/${btn.dataset.slug}`);
    });

    // Analytics
    row.querySelector('.analytics-btn').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      showAnalyticsModal(btn.dataset.id, btn.dataset.title, btn.dataset.slug);
    });

    // Delete
    row.querySelector('.delete-btn').addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      if (!confirm(`Delete "snip/${btn.dataset.slug}"?`)) return;
      try {
        await urlService.delete(btn.dataset.id);
        toast('Link deleted', 'success');
        row.style.animation = 'toastOut 0.2s ease forwards';
        setTimeout(() => row.remove(), 200);
        // Update state
        window.__urls = window.__urls.filter(u => u._id !== btn.dataset.id);
        updateHeaderStats(window.__urls);
      } catch (err) {
        toast(err.message, 'error');
      }
    });

    body.appendChild(row);
  });
}

// ---- Update header stats ----
export function updateHeaderStats(urls) {
  document.getElementById('totalLinks').textContent = urls.length;
  document.getElementById('totalClicks').textContent = urls.reduce((s, u) => s + u.totalClicks, 0);
}

// ---- Analytics Modal ----
async function showAnalyticsModal(id, title, slug) {
  const modal = document.getElementById('analyticsModal');
  document.getElementById('analyticsTitle').textContent = title || slug;
  document.getElementById('analyticsSlug').textContent = `snip/${slug}`;
  modal.classList.remove('hidden');

  try {
    const data = await urlService.getAnalytics(id);

    document.getElementById('statTotal').textContent = data.totalClicks;

    // Today's clicks
    const todayCount = data.last7Days[data.last7Days.length - 1]?.count || 0;
    document.getElementById('statToday').textContent = todayCount;

    // Top device
    const topDevice = Object.entries(data.devices).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('statDevices').textContent = topDevice ? topDevice[0] : '—';

    // Top browser
    const topBrowser = Object.entries(data.browsers).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('statBrowser').textContent = topBrowser ? topBrowser[0] : '—';

    // Chart
    renderChart(data.last7Days);

    // Breakdowns
    renderBreakdown('deviceBreakdown', data.devices);
    renderBreakdown('browserBreakdown', data.browsers);
  } catch (err) {
    toast('Failed to load analytics', 'error');
  }
}

function renderChart(last7Days) {
  const ctx = document.getElementById('clickChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: last7Days.map(d => d.label),
      datasets: [{
        label: 'Clicks',
        data: last7Days.map(d => d.count),
        backgroundColor: 'rgba(0,255,136,0.15)',
        borderColor: '#00ff88',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#161624',
          borderColor: '#00ff88',
          borderWidth: 1,
          titleColor: '#00ff88',
          bodyColor: '#eeeef5',
          callbacks: { label: ctx => ` ${ctx.parsed.y} clicks` }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8888aa', font: { family: 'DM Mono', size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8888aa', font: { family: 'DM Mono', size: 11 }, stepSize: 1 },
          beginAtZero: true
        }
      }
    }
  });
}

function renderBreakdown(containerId, data) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  const total = Object.values(data).reduce((s, v) => s + v, 0) || 1;
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    el.innerHTML = '<p style="color:var(--text-3);font-size:12px;">No data yet</p>';
    return;
  }

  sorted.forEach(([key, val]) => {
    const pct = Math.round((val / total) * 100);
    el.innerHTML += `
      <div class="breakdown-item">
        <span style="font-size:12px;color:var(--text-2);min-width:70px">${key}</span>
        <div class="breakdown-bar-wrap">
          <div class="breakdown-bar" style="width:${pct}%"></div>
        </div>
        <span class="breakdown-count">${val}</span>
      </div>
    `;
  });
}

// ---- QR Modal ----
export function showQrModal(qrCode, url) {
  document.getElementById('qrImage').src = qrCode;
  document.getElementById('qrUrl').textContent = url;
  document.getElementById('qrModal').classList.remove('hidden');
}

// ---- Helpers ----
function getExpiresHtml(expiresAt) {
  if (!expiresAt) return '<span class="expires-never">Never</span>';
  const now = new Date();
  const exp = new Date(expiresAt);
  if (exp < now) return '<span class="expires-expired">Expired</span>';
  const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
  if (days <= 3) return `<span class="expires-soon">${days}d left</span>`;
  return `<span class="expires-ok">${days}d left</span>`;
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}