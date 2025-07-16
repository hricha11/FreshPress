// client/src/components/DailyDigestForm.jsx
import { useState } from 'react';

export default function DailyDigestForm({ articles }) {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/send-digest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, articles }),
      });

      if (res.ok) {
        setStatus('sent');
        setEmail('');
        setShowForm(false);
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <>
      {/* 📧 Mail Icon Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="p-2 rounded-full transition hover:scale-110 hover:bg-sky-200 dark:hover:bg-sky-500/20"
        aria-label="Subscribe to Daily Digest"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600 dark:text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 8V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" />
        </svg>
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="absolute right-6 top-20 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="p-2 rounded border w-full mb-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
          {status === 'sent' && <p className="text-green-500 mt-2">✅ Sent!</p>}
          {status === 'error' && <p className="text-red-500 mt-2">❌ Failed!</p>}
        </form>
      )}
    </>
  );
}
