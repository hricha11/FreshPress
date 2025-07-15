import { useEffect, useState } from 'react';
import NewsCard from './components/NewsCard';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSource, setSelectedSource] = useState('All');

  useEffect(() => {
    setLoading(true);

    // ✅ Dynamic backend URL from .env
    let url = `${process.env.REACT_APP_API_URL}/api/news`;
    if (selectedSource !== 'All') {
      url += `?source=${encodeURIComponent(selectedSource)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch news:', err);
        setLoading(false);
      });
  }, [selectedSource]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 transition-colors duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300">📰 FreshPress</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full transition hover:scale-110 hover:bg-gray-200 dark:hover:bg-yellow-500/20"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              // Sun icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4V2m0 20v-2m10-8h-2M4 12H2
                     m15.536 6.364l1.414 1.414M6.05 6.05L4.636 4.636
                     M18.364 5.636l-1.414 1.414M5.636 18.364l1.414-1.414
                     M12 6a6 6 0 100 12 6 6 0 000-12z"
                />
              </svg>
            ) : (
              // Moon icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Subheading */}
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Your daily dose of headlines from The Hindu, Indian Express, TOI, and more.
        </p>

        {/* Source Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['All', 'The Hindu', 'Indian Express', 'Times of India', 'LiveMint'].map((source) => (
            <button
              key={source}
              onClick={() => setSelectedSource(source)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition
                ${selectedSource === source
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'}
              `}
            >
              {source}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading news...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <NewsCard key={index} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
