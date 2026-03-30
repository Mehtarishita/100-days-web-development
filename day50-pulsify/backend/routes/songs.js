const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Song = require('../models/Song');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only audio files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

// GET all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json({ success: true, count: songs.length, data: songs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single song
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, data: song });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST upload song
router.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No audio file uploaded' });

    const { title, artist, album, genre, duration, coverColor } = req.body;
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const song = await Song.create({
      title: title || path.basename(req.file.originalname, path.extname(req.file.originalname)),
      artist: artist || 'Unknown Artist',
      album: album || 'Unknown Album',
      genre: genre || 'Unknown',
      duration: parseFloat(duration) || 0,
      filename: req.file.filename,
      filepath: `/uploads/${req.file.filename}`,
      coverColor: coverColor || randomColor
    });

    res.status(201).json({ success: true, data: song });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH update song metadata
router.patch('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, data: song });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH increment play count
router.patch('/:id/play', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, { $inc: { playCount: 1 } }, { new: true });
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, data: song });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE song
router.delete('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

// POST save Jamendo song metadata (no file upload — just metadata)
router.post('/save-saavn', async (req, res) => {
  try {
    const { title, artist, album, duration, filepath, coverArt, coverColor, genre } = req.body;

    // Prevent duplicate saves
    const existing = await Song.findOne({ filepath });
    if (existing) return res.status(400).json({ success: false, message: 'Song already in library' });

    const song = await Song.create({
      title,
      artist,
      album: album || 'Unknown Album',
      duration: parseFloat(duration) || 0,
      filename: `saavn_${Date.now()}`,
      filepath,       // Jamendo stream URL stored as filepath
      coverArt: coverArt || '',
      coverColor: coverColor || '#6366f1',
      genre: genre || 'Unknown',
      source: 'saavn'
    });

    res.status(201).json({ success: true, data: song });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});