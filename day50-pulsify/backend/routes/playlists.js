const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

// GET all playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('songs').sort({ pinned: -1, createdAt: -1 });
    res.json({ success: true, count: playlists.length, data: playlists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single playlist
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });
    res.json({ success: true, data: playlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create playlist
router.post('/', async (req, res) => {
  try {
    const { name, description, coverColor } = req.body;
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const playlist = await Playlist.create({
      name,
      description,
      coverColor: coverColor || randomColor
    });

    res.status(201).json({ success: true, data: playlist });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH update playlist
router.patch('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('songs');
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });
    res.json({ success: true, data: playlist });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH add song to playlist
router.patch('/:id/songs/add', async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ success: false, message: 'Song already in playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();
    await playlist.populate('songs');

    res.json({ success: true, data: playlist });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH remove song from playlist
router.patch('/:id/songs/remove', async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });

    playlist.songs = playlist.songs.filter(s => s.toString() !== songId);
    await playlist.save();
    await playlist.populate('songs');

    res.json({ success: true, data: playlist });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE playlist
router.delete('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });
    res.json({ success: true, message: 'Playlist deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;