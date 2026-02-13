import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Analytics() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchAnalytics();
    }
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/analytics?shortId=${id}`);
      const analyticsData = await res.json();
      
      if (res.ok) {
        setData(analyticsData);
      } else {
        setError(analyticsData.error || 'Failed to load analytics');
      }
    } catch (e) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return null;

  return (
    <div className="container">
      <Head>
        <title>Analytics - SnapLink</title>
      </Head>

      <main className="main">
        <h1 className="title">URL Analytics</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Clicks</h3>
            <p className="stat-value">{data.totalClicks}</p>
          </div>
          
          <div className="stat-card">
            <h3>Created</h3>
            <p className="stat-date">{new Date(data.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="url-info">
          <p><strong>Short URL:</strong> <a href={`/${data.shortId}`}>/{data.shortId}</a></p>
          <p><strong>Original URL:</strong> <a href={data.originalUrl} target="_blank" rel="noopener noreferrer">{data.originalUrl}</a></p>
        </div>

        {data.topBrowsers.length > 0 && (
          <div className="section">
            <h2>Top Browsers</h2>
            <div className="browser-list">
              {data.topBrowsers.map(([browser, count]) => (
                <div key={browser} className="browser-item">
                  <span className="browser-name">{browser}</span>
                  <span className="browser-count">{count} clicks</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.keys(data.clicksByDay).length > 0 && (
          <div className="section">
            <h2>Clicks by Day</h2>
            <div className="chart">
              {Object.entries(data.clicksByDay)
                .sort()
                .slice(-7)
                .map(([day, count]) => (
                  <div key={day} className="chart-item">
                    <span className="chart-day">{new Date(day).toLocaleDateString()}</span>
                    <div className="chart-bar">
                      <div 
                        className="chart-fill" 
                        style={{ width: `${Math.min((count / data.totalClicks) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="chart-count">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {data.recentClicks.length > 0 && (
          <div className="section">
            <h2>Recent Clicks</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Browser</th>
                  <th>Device</th>
                </tr>
              </thead>
              <tbody>
                {data.recentClicks.map((click, index) => (
                  <tr key={index}>
                    <td>{new Date(click.timestamp).toLocaleString()}</td>
                    <td>{click.browser?.name || 'Unknown'}</td>
                    <td>{click.device?.type || 'Desktop'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={() => router.push('/')} className="back-btn">
          ← Back to Home
        </button>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 2rem;
          background: #f5f5f5;
        }

        .main {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 0;
        }

        .title {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
        }

        .stat-card h3 {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #667eea;
          margin: 0;
        }

        .stat-date {
          font-size: 1.2rem;
          color: #333;
          margin: 0;
        }

        .url-info {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .url-info p {
          margin: 0.5rem 0;
        }

        .url-info a {
          color: #667eea;
        }

        .section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .section h2 {
          margin-bottom: 1rem;
          color: #333;
        }

        .browser-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .browser-item {
          background: #f8f9fa;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .browser-name {
          font-weight: 600;
        }

        .browser-count {
          color: #667eea;
          font-size: 0.9rem;
        }

        .chart {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .chart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .chart-day {
          width: 100px;
          font-size: 0.9rem;
          color: #666;
        }

        .chart-bar {
          flex: 1;
          height: 24px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }

        .chart-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .chart-count {
          width: 40px;
          text-align: right;
          font-weight: 600;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .table th {
          font-weight: 600;
          color: #666;
        }

        .back-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        }

        .loading, .error {
          text-align: center;
          padding: 4rem;
          font-size: 1.2rem;
        }

        .error {
          color: #c33;
        }
      `}</style>
    </div>
  );
}
