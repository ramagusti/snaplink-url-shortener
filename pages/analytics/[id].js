import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxClicks = Math.max(...Object.values(data.clicksByDay || { today: 1 }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Head>
        <title>Analytics - SnapLink</title>
        <link rel="icon" type="image/png" href="/favicon.png?v=2" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png?v=2" />
      </Head>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-10 h-10">
                <Image src="/logo.png" alt="SnapLink" fill className="object-contain" priority />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SnapLink
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => router.push('/')}
            className="mb-8 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Link Analytics</h1>
            <p className="text-slate-600">Detailed insights for your shortened URL</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-slate-500 font-medium">Total Clicks</span>
              </div>
              <p className="text-4xl font-bold text-slate-900">{data.totalClicks}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-slate-500 font-medium">Created</span>
              </div>
              <p className="text-4xl font-bold text-slate-900">
                {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <span className="text-slate-500 font-medium">Short URL</span>
              </div>
              <a 
                href={`/${data.shortId}`}
                className="text-xl font-bold text-indigo-600 hover:text-indigo-700"
              >
                /{data.shortId}
              </a>
            </div>
          </div>

          {/* URL Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Original URL</h3>
            <a 
              href={data.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 break-all"
            >
              {data.originalUrl}
            </a>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Clicks by Day */}
            {Object.keys(data.clicksByDay || {}).length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Clicks Over Time</h3>
                <div className="space-y-3">
                  {Object.entries(data.clicksByDay)
                    .sort()
                    .slice(-7)
                    .map(([day, count]) => {
                      const percentage = maxClicks > 0 ? (count / maxClicks) * 100 : 0;
                      return (
                        <div key={day} className="flex items-center gap-4">
                          <span className="w-24 text-sm text-slate-500">
                            {new Date(day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-sm font-medium text-slate-700">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Top Browsers */}
            {data.topBrowsers && data.topBrowsers.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Top Browsers</h3>
                <div className="space-y-4">
                  {data.topBrowsers.map(([browser, count], index) => (
                    <div key={browser} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                          {index + 1}
                        </span>
                        <span className="font-medium text-slate-700">{browser}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${(count / data.totalClicks) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-500 w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Clicks Table */}
          {data.recentClicks && data.recentClicks.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Recent Clicks</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Browser</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">OS</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Device</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recentClicks.map((click, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(click.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {click.browser?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {click.os?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            click.device?.type === 'mobile' 
                              ? 'bg-blue-100 text-blue-800'
                              : click.device?.type === 'tablet'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {click.device?.type || 'Desktop'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
