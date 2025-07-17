import React from 'react';
import { useLocation } from 'react-router-dom';

const SummaryPage = () => {
  const { state } = useLocation();

  const article = state?.article;

  if (!article) {
    return <p>No article data found.</p>;
  }

  const { title, summary, source, pubDate, link } = article;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {source} · {new Date(pubDate).toLocaleString()}
      </p>
      <a
        href={link}
        className="text-blue-600 underline mb-4 block"
        target="_blank"
        rel="noreferrer"
      >
        Read Original
      </a>
      <p className="text-base leading-relaxed whitespace-pre-wrap">
        {summary || 'No summary available.'}
      </p>
    </div>
  );
};

export default SummaryPage;
