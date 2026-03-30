const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Playlist name is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  coverColor: {
    type: String,
    default: '#6366f1'
  },
  pinned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Virtual for song count
playlistSchema.virtual('songCount').get(function() {
  return this.songs.length;
});

playlistSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Playlist', playlistSchema);