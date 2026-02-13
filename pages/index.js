import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await fetch('/api/shorten');
      const data = await res.json();
      setUrls(data);
    } catch (e) {
      console.error('Failed to fetch URLs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, customAlias: customAlias || undefined })
      });

      const data = await res.json();

      if (res.ok) {
        setShortUrl(data.shortUrl);
        setUrl('');
        setCustomAlias('');
        fetchUrls();
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (e) {
      setError('Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert('Copied to clipboard!');
  };

  return (
    <div className="container">
      <Head>
        <title>SnapLink - URL Shortener with Analytics</title>
        <meta name="description" content="Simple URL shortener with analytics" />
      </Head>

      <main className="main">
        <h1 className="title">SnapLink</h1>
        <p className="subtitle">Shorten URLs and track analytics</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your long URL..."
              required
              className="input"
            />
          </div>
          
          <div className="input-group">
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="Custom alias (optional)"
              className="input"
            />
          </div>

          <button type="submit" disabled={loading} className="button">
            {loading ? 'Creating...' : 'Shorten URL'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {shortUrl && (
          <div className="result">
            <p>Your short URL:</p>
            <div className="short-url">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
              <button onClick={copyToClipboard} className="copy-btn">
                Copy
              </button>
            </div>
          </div>
        )}

        {urls.length > 0 && (
          <div className="urls-list">
            <h2>Your URLs</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Short URL</th>
                  <th>Clicks</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((item) => (
                  <tr key={item.shortId}>
                    <td>
                      <a href={`/${item.shortId}`} target="_blank" rel="noopener noreferrer">
                        /{item.shortId}
                      </a>
                      <br />
                      <small className="original-url">{item.originalUrl}</small>
                    </td>
                    <td>{item.clicks}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .main {
          max-width: 800px;
          margin: 0 auto;
          padding: 4rem 0;
        }

        .title {
          text-align: center;
          color: white;
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.2rem;
          margin-bottom: 3rem;
        }

        .form {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          margin-bottom: 2rem;
        }

        .input-group {
          margin-bottom: 1rem;
        }

        .input {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          transition: border-color 0.2s;
        }

        .input:focus {
          outline: none;
          border-color: #667eea;
        }

        .button {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }

        .button:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          background: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
        }

        .result {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          margin-bottom: 2rem;
          text-align: center;
        }

        .short-url {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 1rem;
        }

        .short-url a {
          color: #667eea;
          font-size: 1.2rem;
          font-weight: 600;
          text-decoration: none;
        }

        .copy-btn {
          padding: 0.5rem 1rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .urls-list {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .urls-list h2 {
          margin-bottom: 1rem;
          color: #333;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .table th {
          font-weight: 600;
          color: #666;
        }

        .table a {
          color: #667eea;
          text-decoration: none;
        }

        .original-url {
          color: #999;
          font-size: 0.85rem;
          display: block;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
