import React from 'react';

const NewsCard = ({ title, summary, link, source, pubDate }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
    >
      <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{summary}</p>
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <span>{source}</span>
        <span>{new Date(pubDate).toLocaleString()}</span>
      </div>
    </a>
  );
};

export default NewsCard;
