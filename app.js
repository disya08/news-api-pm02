const express = require('express');
const app = express();

app.use(express.json());

const db = require('./connection');

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/topics', async (req, res) => {
  try {
    const topics = await db('topics').select('*');
    res.json({ topics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const articles = await db('articles').select('*');
    res.json({ articles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

app.get('/api/articles/:article_id', async (req, res) => {
  try {
    const article = await db('articles')
      .where('article_id', req.params.article_id)
      .first();
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.json({ article });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = app;
