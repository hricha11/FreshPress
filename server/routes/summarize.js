const express = require('express');
const router = express.Router();
const summarizeArticle = require('../summarizeArticle');

router.post('/', async (req, res) => {
  const { articleText } = req.body;

  if (!articleText || typeof articleText !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing article text' });
  }

  try {
    console.log('Received article text:', articleText);
    const summary = await summarizeArticle(articleText);
    res.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error.message);
    res.status(500).json({ error: 'Failed to summarize article', details: error.message });
  }
});

module.exports = router;
