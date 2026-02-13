import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'urls.json');

function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export default async function handler(req, res) {
  const { method } = req;
  const { shortId } = req.query;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = readData();

  if (shortId) {
    // Get analytics for specific URL
    const entry = data[shortId];
    
    if (!entry) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const analytics = {
      shortId,
      originalUrl: entry.url,
      totalClicks: entry.clicks,
      createdAt: entry.createdAt,
      clicksByDay: getClicksByDay(entry.analytics),
      topBrowsers: getTopBrowsers(entry.analytics),
      recentClicks: entry.analytics.slice(-10).reverse()
    };

    return res.status(200).json(analytics);
  }

  // Get overall stats
  const totalUrls = Object.keys(data).length;
  const totalClicks = Object.values(data).reduce((sum, entry) => sum + entry.clicks, 0);

  return res.status(200).json({
    totalUrls,
    totalClicks,
    urls: Object.entries(data).map(([id, entry]) => ({
      shortId: id,
      originalUrl: entry.url,
      clicks: entry.clicks,
      createdAt: entry.createdAt
    }))
  });
}

function getClicksByDay(analytics) {
  const clicksByDay = {};
  analytics.forEach(click => {
    const day = click.timestamp.split('T')[0];
    clicksByDay[day] = (clicksByDay[day] || 0) + 1;
  });
  return clicksByDay;
}

function getTopBrowsers(analytics) {
  const browsers = {};
  analytics.forEach(click => {
    const browser = click.browser?.name || 'Unknown';
    browsers[browser] = (browsers[browser] || 0) + 1;
  });
  return Object.entries(browsers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}
