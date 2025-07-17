import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// ✅ Fix for Create React App
const API_BASE_URL = process.env.REACT_APP_API_URL;


const SummaryPage = () => {
  const { state } = useLocation();
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  const article = state?.article;

  useEffect(() => {
    if (!article?.content) return;

    const fetchSummary = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/summarize`, {
          content: article.content,
        });
        setSummary(response.data.summary);
      } catch (err) {
        setSummary('Failed to generate summary.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [article]);

  if (!article) {
    return <p>No article data found.</p>;
  }

  const { title, content, source, pubDate, link } = article;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {source} · {new Date(pubDate).toLocaleString()}
      </p>
      <a href={link} className="text-blue-600 underline mb-4 block" target="_blank" rel="noreferrer">
        Read Original
      </a>

      {loading ? (
        <p className="italic">Generating summary...</p>
      ) : (
        <p className="text-base leading-relaxed whitespace-pre-wrap">{summary}</p>
      )}
    </div>
  );
};

export default SummaryPage;
