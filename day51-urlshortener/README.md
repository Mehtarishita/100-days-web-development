# ⌁ Snip — Day 51 URL Shortener

> Full-stack URL shortener with click analytics, QR code generation, custom slugs, and link expiry.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla JS ES Modules, HTML5, CSS3, Chart.js |
| Backend | Node.js + Express 4 |
| Database | MongoDB Atlas + Mongoose |
| Short ID | nanoid |
| QR Code | qrcode (npm) |
| UA Parsing | ua-parser-js |

## Features
- 🔗 Shorten any URL instantly
- ✏️ Custom slug support
- 📊 Click analytics with Chart.js (last 7 days)
- 📱 QR code generation + download
- 📋 Copy to clipboard
- ⏰ Link expiry (1d / 7d / 30d / 90d / never)
- 🌍 Device + browser tracking per click
- 🗑️ Delete links
- 🔍 Search/filter links

## API Endpoints

```
GET    /api/urls              — All URLs
POST   /api/urls              — Create short URL
GET    /api/urls/:id          — Single URL
GET    /api/urls/:id/analytics — Click analytics
PATCH  /api/urls/:id          — Update URL
DELETE /api/urls/:id          — Delete URL
GET    /:slug                 — Redirect + track click
```

## Setup

```bash
# Backend
cd backend
npm install
# Edit .env — add MongoDB URI
npm run dev    # runs on port 5001

# Frontend
# Open frontend/index.html with Live Server
```

## .env
```
PORT=5001
MONGO_URI=mongodb+srv://...@cluster0.xxx.mongodb.net/urlshortener?...
BASE_URL=http://localhost:5001
NODE_ENV=development
```