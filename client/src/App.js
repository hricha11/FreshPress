import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NewsCard from './components/NewsCard';
import SummaryPage from './pages/SummaryPage';
import Layout from './components/Layout';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSource, setSelectedSource] = useState('All');

  useEffect(() => {
    setLoading(true);
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
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            news={news}
          />
        }
      >
        <Route
          index
          element={
            <div className="px-4 md:px-8">
              {/* Filter Buttons (only on homepage) */}
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

              {/* News Cards */}
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
          }
        />
        <Route path="summary" element={<SummaryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
