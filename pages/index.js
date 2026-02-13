import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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
    setCopied(false);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Head>
        <title>SnapLink - Professional URL Shortener</title>
        <meta name="description" content="Shorten URLs and track analytics with SnapLink" />
        <link rel="icon" type="image/png" href="/favicon.png?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png?v=2" />
      </Head>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="SnapLink"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SnapLink
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium">
                Features
              </a>
              <a href="#analytics" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium">
                Analytics
              </a>
              <a 
                href="https://github.com/ramagusti/snaplink-url-shortener" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-sm font-medium text-indigo-700">Free & Open Source</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Shorten URLs with{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Style
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Create short, memorable links and track detailed analytics. 
              Clean, fast, and completely free.
            </p>

            {/* URL Shortener Form */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-2 max-w-3xl mx-auto border border-slate-100">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your long URL here..."
                    required
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="Custom alias (optional)"
                  className="sm:w-48 px-4 py-4 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Shortening...
                    </span>
                  ) : (
                    'Shorten'
                  )}
                </button>
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 max-w-3xl mx-auto">
                {error}
              </div>
            )}

            {/* Success Result */}
            {shortUrl && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl max-w-3xl mx-auto">
                <p className="text-sm font-medium text-green-700 mb-2">Your short link is ready!</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {shortUrl}
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      copied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why SnapLink?</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Everything you need to manage and track your links
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Lightning Fast</h3>
                <p className="text-slate-600">Generate short links instantly with our optimized infrastructure.</p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Detailed Analytics</h3>
                <p className="text-slate-600">Track clicks, browsers, devices, and referrers for every link.</p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Custom Aliases</h3>
                <p className="text-slate-600">Create memorable links with your own custom short codes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent URLs Section */}
        {urls.length > 0 && (
          <section id="analytics" className="py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Your Links</h2>
                <span className="text-slate-500">{urls.length} total</span>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Short URL</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Original URL</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Clicks</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {urls.slice(0, 10).map((item) => (
                        <tr key={item.shortId} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <a 
                              href={`/${item.shortId}`}
                              className="text-indigo-600 font-medium hover:text-indigo-700"
                            >
                              /{item.shortId}
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-600 text-sm truncate max-w-xs block" title={item.originalUrl}>
                              {item.originalUrl}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {item.clicks}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-slate-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="SnapLink" fill className="object-contain" />
              </div>
              <span className="font-semibold text-slate-900">SnapLink</span>
            </div>
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} SnapLink. Open source on{' '}
              <a href="https://github.com/ramagusti/snaplink-url-shortener" className="text-indigo-600 hover:underline">
                GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
