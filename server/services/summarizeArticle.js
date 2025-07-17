const axios = require('axios');

async function summarizeArticle(articleText) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: articleText },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        timeout: 10000, // Optional timeout
      }
    );

    if (Array.isArray(response.data) && response.data[0]?.summary_text) {
      return response.data[0].summary_text;
    } else if (response.data.error) {
      throw new Error(`Hugging Face API error: ${response.data.error}`);
    } else {
      throw new Error('Unexpected response from summarization API');
    }
  } catch (error) {
    console.error('Error summarizing article:', error.message || error);
    throw error;
  }
}

module.exports = summarizeArticle;
