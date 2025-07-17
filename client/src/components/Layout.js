// src/components/Layout.js
import { Outlet } from 'react-router-dom';
import DailyDigestForm from './DailyDigestForm';

export default function Layout({ darkMode, toggleDarkMode, news, selectedSource, setSelectedSource }) {
  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 transition-colors duration-300">
        
        {/* Header / Navbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300">📰 FreshPress</h1>
          <div className="flex items-center gap-3">
            <DailyDigestForm articles={news.slice(0, 5)} />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full transition hover:scale-110 hover:bg-gray-200 dark:hover:bg-yellow-500/20"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4V2m0 20v-2m10-8h-2M4 12H2
                    m15.536 6.364l1.414 1.414M6.05 6.05L4.636 4.636
                    M18.364 5.636l-1.414 1.414M5.636 18.364l1.414-1.414
                    M12 6a6 6 0 100 12 6 6 0 000-12z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Subheading */}
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Your daily dose of headlines from The Hindu, Indian Express, TOI, and more.
        </p>

        {/* Dynamic Page Content */}
        <Outlet />
      </div>
    </div>
  );
}
