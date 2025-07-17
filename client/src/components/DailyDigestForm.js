import { useState, useRef, useEffect } from 'react';

export default function DailyDigestForm({ articles = [] }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (
        formRef.current &&
        !formRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
        setStatus('idle');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Auto-hide success after short delay
  useEffect(() => {
    if (status !== 'sent') return;
    const t = setTimeout(() => {
      setOpen(false);
      setStatus('idle');
    }, 2000);
    return () => clearTimeout(t);
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/send-digest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // send only top few articles to reduce payload
        body: JSON.stringify({ email, articles: articles.slice(0, 5) }),
      });

      if (!res.ok) throw new Error('send-failed');
      setStatus('sent');
      setEmail('');
    } catch (err) {
      console.error('Digest send failed:', err);
      setStatus('error');
    }
  }

  return (
    <div className="relative inline-block">
      {/* 📧 Mail Icon Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-full transition hover:scale-110 hover:bg-sky-200 dark:hover:bg-sky-500/20"
        aria-label="Subscribe to Daily Digest"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-sky-600 dark:text-sky-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 8V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z"
          />
        </svg>
      </button>

      {/* Dropdown Form */}
      {open && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="absolute top-12 right-0 z-50 w-72 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            📬 Daily Digest
          </h3>

          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mb-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setStatus('idle');
              }}
              className="px-3 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-3 py-2 text-sm font-medium rounded-md bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Subscribe'}
            </button>
          </div>

          {/* Status */}
          <div className="mt-3 min-h-[1.25rem]" aria-live="polite" aria-atomic="true">
            {status === 'sent' && (
              <p className="text-green-600 dark:text-green-400 text-sm">✅ Sent! Check inbox.</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 dark:text-red-400 text-sm">❌ Failed. Try again.</p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
