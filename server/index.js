const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');

const app = express();
const parser = new Parser();
const PORT = process.env.PORT || 5000;

// ✅ CORS for frontend on Vercel
app.use(cors({ origin: 'https://fresh-press-orpin.vercel.app' }));

// ✅ Optional root route
app.get('/', (req, res) => {
  res.send('✅ FreshPress backend is live!');
});

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

app.listen(PORT, () => {
  console.log(`✅ FreshPress backend running at http://localhost:${PORT}`);
});
