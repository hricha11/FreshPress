const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');
require('dotenv').config();

const summarizeArticle = require('./services/summarizeArticle');
const sendDigestEmail = require('./services/sendEmail');

const app = express();
const parser = new Parser();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://fresh-press-orpin.vercel.app']
}));
app.use(express.json());

// ✅ Root check
app.get('/', (req, res) => {
  res.send('✅ FreshPress backend is live!');
});

// ✅ News sources
const sources = [
  {
    name: 'The Hindu',
    url: 'https://www.thehindu.com/feeder/default.rss',
  },
  {
    name: 'Indian Express',
    url: 'https://indianexpress.com/section/india/feed/',
  },
  {
    name: 'Times of India',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
  },
  {
    name: 'LiveMint',
    url: 'https://www.livemint.com/rss/news',
  },
];

// ✅ GET /api/news
app.get('/api/news', async (req, res) => {
  const selectedSource = req.query.source;
  const results = [];

  try {
    for (const source of sources) {
      if (selectedSource && source.name !== selectedSource) continue;

      try {
        const feed = await parser.parseURL(source.url);
        feed.items.slice(0, 5).forEach((item) => {
          results.push({
            title: item.title,
            summary: item.contentSnippet || item.content || '',
            link: item.link,
            source: source.name,
            pubDate: item.pubDate,
          });
        });
      } catch (err) {
        console.error(`❌ Failed to fetch from ${source.name}:`, err.message);
      }
    }

    res.json(results);
  } catch (err) {
    console.error('🔥 General Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// ✅ POST /api/send-digest
app.post('/api/send-digest', async (req, res) => {
  const { email, articles } = req.body;

  if (!email || !Array.isArray(articles)) {
    return res.status(400).json({ error: 'Invalid request. Provide email and articles array.' });
  }

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2 style="color: #007BFF;">📰 Your FreshPress Daily Digest</h2>
      <p>Here are your top ${articles.length} headlines today:</p>
      <ul>
        ${articles.map(article => `
          <li style="margin-bottom: 10px;">
            <a href="${article.link}" style="color: #333; text-decoration: none; font-weight: bold;">
              ${article.title}
            </a>
            <p style="margin: 4px 0 0; color: #555;">${article.summary}</p>
          </li>
        `).join('')}
      </ul>
      <p style="margin-top: 20px;">Stay informed!<br/>— The FreshPress Team</p>
    </div>
  `;

  try {
    await sendDigestEmail(email, '🗞️ Your FreshPress Daily Digest', html);
    console.log('✅ Digest email sent to:', email);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Failed to send digest email:', err.message);
    res.status(500).json({ error: 'Failed to send digest email' });
  }
});

// ✅ POST /api/summarize
app.post('/api/summarize', async (req, res) => {
  const { articleText } = req.body;

  if (!articleText || typeof articleText !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing article text.' });
  }

  try {
    console.log('🔍 Summarizing article...');
    const summary = await summarizeArticle(articleText);
    res.json({ summary });
  } catch (err) {
    console.error('❌ Summarization failed:', err.message);
    res.status(500).json({ error: 'Failed to summarize article' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ FreshPress backend running at http://localhost:${PORT}`);
});
