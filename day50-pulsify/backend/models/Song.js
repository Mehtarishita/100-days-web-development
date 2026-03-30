const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true
  },
  album: {
    type: String,
    default: 'Unknown Album',
    trim: true
  },
  duration: {
    type: Number,
    default: 0
  },
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  coverArt: {
    type: String,
    default: ''   // URL for Jamendo cover art
  },
  coverColor: {
    type: String,
    default: '#6366f1'
  },
  playCount: {
    type: Number,
    default: 0
  },
  genre: {
    type: String,
    default: 'Unknown'
  },
  source: {
    type: String,
    enum: ['upload', 'saavn'],
    default: 'upload'
  }
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);