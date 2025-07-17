import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegQuestionCircle } from 'react-icons/fa';

const NewsCard = ({ title, summary, link, source, pubDate, fullContent }) => {
  const navigate = useNavigate();

  const handleSummaryClick = (e) => {
    e.preventDefault();
    navigate('/summary', {
      state: {
        article: {
          title,
          summary,
          source,
          pubDate,
          link,
          content: fullContent || summary || link,
        },
      },
    });
  };

  return (
    <div className="relative h-full">
      {/* Floating summarize icon */}
      <button
        className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-1.5 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
        title="Summarize this article"
        onClick={handleSummaryClick}
      >
        <FaRegQuestionCircle className="text-blue-600 hover:text-blue-800" size={18} />
      </button>

      {/* Card box with equal height support */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full p-4 pt-8 pr-8 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
      >
        <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300">{title}</h2>

        {/* You asked to hide the summary/body, so this is removed */}
        {/* <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{summary}</p> */}

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>{source}</span>
          <span>{new Date(pubDate).toLocaleString()}</span>
        </div>
      </a>
    </div>
  );
};

export default NewsCard;
