import { urlService } from './api.js';
import { renderLinks, updateHeaderStats, showQrModal } from './ui.js';
import { toast } from './toast.js';

// ---- Init ----
async function init() {
  try {
    const urls = await urlService.getAll();
    window.__urls = urls;
    renderLinks(urls);
    updateHeaderStats(urls);
  } catch (err) {
    toast('Backend offline — run: npm run dev in /backend', 'error', 5000);
    console.error('Init error:', err);
  }
}

// ---- Shorten Form ----
const shortenBtn = document.getElementById('shortenBtn');
const urlInput = document.getElementById('urlInput');
const slugInput = document.getElementById('slugInput');
const titleInput = document.getElementById('titleInput');
const expiresIn = document.getElementById('expiresIn');
const resultRow = document.getElementById('resultRow');
const resultUrl = document.getElementById('resultUrl');

shortenBtn.addEventListener('click', handleShorten);
urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleShorten(); });

async function handleShorten() {
  const originalUrl = urlInput.value.trim();
  if (!originalUrl) { toast('Please enter a URL', 'error'); urlInput.focus(); return; }

  shortenBtn.classList.add('loading');
  shortenBtn.querySelector('span').textContent = 'Shortening...';

  try {
    const url = await urlService.create({
      originalUrl,
      slug: slugInput.value.trim(),
      title: titleInput.value.trim(),
      expiresIn: expiresIn.value
    });

    // Show result
    const shortUrl = `https://url-shortner-free-backend.vercel.app/${url.slug}`;
    resultUrl.textContent = shortUrl;
    resultUrl.href = shortUrl;
    resultRow.classList.remove('hidden');

    // Store QR for result row buttons
    resultRow.dataset.qr = url.qrCode;
    resultRow.dataset.slug = url.slug;

    // Add to table
    window.__urls = [url, ...(window.__urls || [])];
    renderLinks(window.__urls);
    updateHeaderStats(window.__urls);

    // Clear form
    urlInput.value = '';
    slugInput.value = '';
    titleInput.value = '';
    expiresIn.value = 'never';

    toast(`🔗 Link created: snip/${url.slug}`, 'success');
  } catch (err) {
    toast(err.message || 'Failed to shorten URL', 'error');
  } finally {
    shortenBtn.classList.remove('loading');
    shortenBtn.querySelector('span').textContent = 'Shorten';
  }
}

// ---- Copy result ----
document.getElementById('copyBtn').addEventListener('click', () => {
  const url = resultUrl.textContent;
  if (!url) return;
  navigator.clipboard.writeText(url).then(() => toast('Copied to clipboard!', 'success', 1500));
});

// ---- QR from result ----
document.getElementById('qrBtn').addEventListener('click', () => {
  const qr = resultRow.dataset.qr;
  const slug = resultRow.dataset.slug;
  if (qr) showQrModal(qr, `https://url-shortner-free-backend.vercel.app/${slug}`);
});

// ---- Search ----
document.getElementById('searchInput').addEventListener('input', (e) => {
  renderLinks(window.__urls || [], e.target.value.trim());
});

// ---- Analytics Modal close ----
document.getElementById('closeAnalytics').addEventListener('click', () => {
  document.getElementById('analyticsModal').classList.add('hidden');
});
document.getElementById('analyticsModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('analyticsModal'))
    document.getElementById('analyticsModal').classList.add('hidden');
});

// ---- QR Modal close ----
document.getElementById('closeQr').addEventListener('click', () => {
  document.getElementById('qrModal').classList.add('hidden');
});
document.getElementById('qrModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('qrModal'))
    document.getElementById('qrModal').classList.add('hidden');
});

// ---- Download QR ----
document.getElementById('downloadQr').addEventListener('click', () => {
  const img = document.getElementById('qrImage');
  const a = document.createElement('a');
  a.href = img.src;
  a.download = `snip-qr-${Date.now()}.png`;
  a.click();
  toast('QR Code downloaded!', 'success', 1500);
});

// ---- Start ----
init();