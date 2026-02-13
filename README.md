# SnapLink - URL Shortener with Analytics

A simple URL shortener with click analytics built with Next.js.

## Features

- 🔗 Shorten any URL
- 📊 Track clicks and analytics
- 🎯 Custom aliases
- 📱 Browser & device tracking
- 📈 Click charts by day
- 🎨 Beautiful UI

## Tech Stack

- Next.js 14
- React
- nanoid (for short IDs)
- ua-parser-js (for analytics)

## Deployment

This app is designed to be deployed on Vercel for full API route support.

### Deploy to Vercel

1. Push this repo to GitHub
2. Import to Vercel
3. Deploy!

### Environment Variables

None required for basic functionality.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Create Short URL
```
POST /api/shorten
Body: { "url": "https://example.com", "customAlias": "optional" }
```

### Redirect
```
GET /{shortId}
```

### Get Analytics
```
GET /api/analytics?shortId={id}
```

## Data Storage

URLs are stored in a local JSON file (`data/urls.json`). For production, consider using a database like Redis, MongoDB, or PostgreSQL.

## License

MIT
