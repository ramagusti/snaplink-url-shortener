# 🔗 SnapLink - Modern URL Shortener with Analytics

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-purple)](https://snaplink-url-shortener.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-View%20Code-black)](https://github.com/ramagusti/snaplink-url-shortener)

> **Shorten URLs. Track clicks. Understand your audience.** A full-featured URL shortener with beautiful analytics dashboard.

![SnapLink Preview](https://snaplink-url-shortener.vercel.app/favicon.png)

## ✨ What It Does

**SnapLink** transforms long, ugly URLs into clean, shareable links while giving you powerful insights into who's clicking them. Perfect for marketers, developers, and anyone who wants to track link performance.

### Key Features

- 🔗 **Smart URL Shortening** - Generate short links instantly with nanoid
- 📊 **Click Analytics** - Track clicks, devices, browsers, and locations
- 📈 **Visual Charts** - Beautiful charts showing clicks over time
- 🎯 **Custom Aliases** - Create memorable custom short URLs
- 📱 **Device Detection** - See what devices your audience uses
- 🎨 **Beautiful UI** - Modern gradient design with Tailwind CSS
- 📱 **PWA Ready** - Install as a Progressive Web App

## 🚀 Live Demo

**👉 https://snaplink-url-shortener.vercel.app**

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | Full-stack React framework |
| **Tailwind CSS v3** | Modern, responsive styling |
| **nanoid** | Secure, unique short IDs |
| **ua-parser-js** | User agent parsing for analytics |
| **Recharts** | Interactive data visualization |
| **Vercel** | Serverless deployment |

## 💡 Use Cases

- **Marketing Campaigns** - Track link performance across channels
- **Social Media** - Clean URLs for bio links and posts
- **Email Marketing** - Monitor email click-through rates
- **QR Codes** - Short URLs perfect for QR generation
- **Affiliate Links** - Mask and track referral links

## 📡 API Endpoints

```bash
# Create short URL
POST /api/shorten
{
  "url": "https://example.com/very/long/url",
  "customAlias": "my-link"  // optional
}

# Redirect to original URL
GET /{shortId}

# Get detailed analytics
GET /api/analytics?shortId={id}
```

## 🎯 Why I Built This

Existing URL shorteners are either too simple (no analytics) or too expensive (Bitly Pro). I wanted a **beautiful, feature-rich alternative** that anyone can self-host for free.

This project demonstrates:
- Full-stack development with Next.js
- Data visualization and analytics
- Modern UI/UX design
- Serverless architecture

## 📈 Features Showcase

### Analytics Dashboard
- **Click Count** - Total and unique clicks
- **Timeline Chart** - Clicks over time (last 7 days)
- **Device Breakdown** - Desktop vs Mobile vs Tablet
- **Browser Stats** - Chrome, Safari, Firefox, etc.
- **OS Detection** - Windows, macOS, iOS, Android

### User Experience
- **Instant Shortening** - No page reloads
- **Copy to Clipboard** - One-click copying
- **QR Code Ready** - Short URLs work great with QR
- **Responsive Design** - Works perfectly on mobile

## 🏆 What I Learned

- **Analytics Engineering** - Collecting and visualizing user data
- **Serverless Storage** - Working with temporary filesystems
- **UI/UX Design** - Creating intuitive user flows
- **Performance** - Optimizing for fast load times

## 🔮 Future Roadmap

- [ ] User accounts for saved links
- [ ] Custom domains support
- [ ] UTM parameter builder
- [ ] A/B testing for links
- [ ] Team collaboration features
- [ ] API key authentication

## 🚀 Deployment

### Deploy to Vercel
```bash
# One-click deploy
npx vercel --prod
```

### Local Development
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 📄 License

MIT License - Feel free to use and modify.

---

**Built by Rama Gusti** | [Portfolio](https://github.com/ramagusti) | [Twitter](#)

*Part of the "Vibe-Coding SaaS Tools" collection.*
