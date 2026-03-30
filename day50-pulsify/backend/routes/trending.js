const express = require('express');
const router = express.Router();

// Mock data for trending songs
const trendingSongs = [
  { id: 1, title: 'Song 1', artist: 'Artist 1', source: 'local' },
  { id: 2, title: 'Song 2', artist: 'Artist 2', source: 'local' },
  { id: 3, title: 'Song 3', artist: 'Artist 3', source: 'local' },
];

// GET /api/trending
router.get('/', (req, res) => {
  try {
    res.json(trendingSongs);
  } catch (error) {
    console.error('Error fetching trending songs:', error);
    res.status(500).json({ error: 'Failed to fetch trending songs' });
  }
});

module.exports = router;