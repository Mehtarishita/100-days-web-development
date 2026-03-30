const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const QRCode = require('qrcode');
const Url = require('../models/Url');

// GET all URLs
router.get('/', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json({ success: true, count: urls.length, data: urls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single URL with analytics
router.get('/:id', async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ success: false, message: 'URL not found' });
    res.json({ success: true, data: url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET analytics for a URL — clicks per day (last 7 days)
router.get('/:id/analytics', async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ success: false, message: 'URL not found' });

    // Last 7 days click breakdown
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const count = url.clicks.filter(c => {
        const cd = new Date(c.timestamp);
        return cd.toDateString() === d.toDateString();
      }).length;
      last7.push({ label, count });
    }

    // Device breakdown
    const devices = url.clicks.reduce((acc, c) => {
      acc[c.device] = (acc[c.device] || 0) + 1;
      return acc;
    }, {});

    // Browser breakdown
    const browsers = url.clicks.reduce((acc, c) => {
      acc[c.browser] = (acc[c.browser] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalClicks: url.totalClicks,
        last7Days: last7,
        devices,
        browsers,
        recentClicks: url.clicks.slice(-10).reverse()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create short URL
router.post('/', async (req, res) => {
  try {
    let { originalUrl, slug, title, expiresIn } = req.body;

    // Validate URL
    try { new URL(originalUrl); } catch {
      return res.status(400).json({ success: false, message: 'Invalid URL format' });
    }

    // Add https if missing
    if (!originalUrl.startsWith('http')) originalUrl = `https://${originalUrl}`;

    // Generate slug if not provided
    if (!slug || slug.trim() === '') {
      slug = nanoid(7);
    } else {
      // Check slug taken
      const existing = await Url.findOne({ slug: slug.toLowerCase() });
      if (existing) return res.status(400).json({ success: false, message: 'Slug already taken. Try another.' });
    }

    // Calculate expiry
    let expiresAt = null;
    if (expiresIn && expiresIn !== 'never') {
      expiresAt = new Date();
      const days = { '1d': 1, '7d': 7, '30d': 30, '90d': 90 };
      expiresAt.setDate(expiresAt.getDate() + (days[expiresIn] || 7));
    }

    // Generate QR code
    const shortUrl = `${process.env.BASE_URL}/${slug}`;
    const qrCode = await QRCode.toDataURL(shortUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    const url = await Url.create({
      originalUrl,
      slug: slug.toLowerCase(),
      title: title || '',
      expiresAt,
      qrCode
    });

    res.status(201).json({ success: true, data: url });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Slug already taken. Try another.' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH update URL
router.patch('/:id', async (req, res) => {
  try {
    const url = await Url.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!url) return res.status(404).json({ success: false, message: 'URL not found' });
    res.json({ success: true, data: url });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE url
router.delete('/:id', async (req, res) => {
  try {
    const url = await Url.findByIdAndDelete(req.params.id);
    if (!url) return res.status(404).json({ success: false, message: 'URL not found' });
    res.json({ success: true, message: 'URL deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;