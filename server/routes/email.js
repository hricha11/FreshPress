const express = require('express');
const { sendDigestEmail } = require('../services/sendgridService');
const Parser = require('rss-parser');
const router = express.Router();
const parser = new Parser();

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

router.post('/send-digest', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    let allNews = [];

    for (const source of sources) {
      const feed = await parser.parseURL(source.url);
      const items = feed.items.slice(0, 2); // 2 top items from each source

      const formatted = items.map((item) => ({
        title: item.title,
        summary: item.contentSnippet || '',
        link: item.link,
      }));

      allNews = allNews.concat(formatted);
    }

    await sendDigestEmail(email, allNews);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
