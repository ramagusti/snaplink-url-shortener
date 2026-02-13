import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';
import UAParser from 'ua-parser-js';

const DATA_FILE = path.join('/tmp', 'urls.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  const { method } = req;
  const { shortId } = req.query;

  if (method === 'POST') {
    // Create short URL
    const { url, customAlias } = req.body;
    
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const data = readData();
    const id = customAlias || nanoid(6);
    
    if (data[id] && customAlias) {
      return res.status(409).json({ error: 'Alias already exists' });
    }

    data[id] = {
      url,
      createdAt: new Date().toISOString(),
      clicks: 0,
      analytics: []
    };

    writeData(data);

    return res.status(201).json({
      shortId: id,
      shortUrl: `${req.headers.origin || ''}/${id}`,
      originalUrl: url
    });
  }

  if (method === 'GET' && shortId) {
    // Redirect to original URL
    const data = readData();
    const entry = data[shortId];

    if (!entry) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Track analytics
    const parser = new UAParser(req.headers['user-agent']);
    const analytics = {
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      browser: parser.getBrowser(),
      os: parser.getOS(),
      device: parser.getDevice(),
      referer: req.headers.referer || 'direct'
    };

    entry.clicks++;
    entry.analytics.push(analytics);
    writeData(data);

    return res.redirect(302, entry.url);
  }

  if (method === 'GET') {
    // Get all URLs (for dashboard)
    const data = readData();
    const urls = Object.entries(data).map(([id, entry]) => ({
      shortId: id,
      originalUrl: entry.url,
      clicks: entry.clicks,
      createdAt: entry.createdAt
    }));

    return res.status(200).json(urls);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
