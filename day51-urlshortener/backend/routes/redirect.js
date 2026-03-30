const express = require('express');
const router = express.Router();
const UAParser = require('ua-parser-js');
const Url = require('../models/Url');

// GET /:slug — redirect + track click
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Skip API routes
    if (slug.startsWith('api')) return res.status(404).json({ message: 'Not found' });

    const url = await Url.findOne({ slug, isActive: true });

    if (!url) {
      return res.status(404).send(`
        <html>
          <body style="font-family:sans-serif;text-align:center;padding:80px;background:#0a0a0c;color:#fff;">
            <h1 style="font-size:48px">🔗</h1>
            <h2>Link not found</h2>
            <p style="color:#666">This short link doesn't exist or has been deleted.</p>
          </body>
        </html>
      `);
    }

    // Check expiry
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).send(`
        <html>
          <body style="font-family:sans-serif;text-align:center;padding:80px;background:#0a0a0c;color:#fff;">
            <h1 style="font-size:48px">⏰</h1>
            <h2>Link expired</h2>
            <p style="color:#666">This short link has expired.</p>
          </body>
        </html>
      `);
    }

    // Parse user agent
    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();

    const deviceType = result.device.type
      ? result.device.type.charAt(0).toUpperCase() + result.device.type.slice(1)
      : 'Desktop';

    // Track click
    url.clicks.push({
      timestamp: new Date(),
      device: deviceType,
      browser: result.browser.name || 'Unknown',
      os: result.os.name || 'Unknown',
      ip: req.ip || req.connection.remoteAddress || 'Unknown'
    });
    url.totalClicks += 1;
    await url.save();

    // Redirect
    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;