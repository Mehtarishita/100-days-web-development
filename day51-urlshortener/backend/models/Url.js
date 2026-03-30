const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  device: { type: String, default: 'Unknown' },    // Mobile / Desktop / Tablet
  browser: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  country: { type: String, default: 'Unknown' },
  ip: { type: String, default: '' }
}, { _id: false });

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9_-]+$/, 'Slug can only contain letters, numbers, hyphens and underscores']
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  clicks: [clickSchema],
  totalClicks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null   // null = never expires
  },
  qrCode: {
    type: String,   // base64 QR code image
    default: ''
  }
}, { timestamps: true });

// Virtual — short URL
urlSchema.virtual('shortUrl').get(function () {
  return `${process.env.BASE_URL}/${this.slug}`;
});

urlSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Url', urlSchema);