const express = require('express');
const serverless = require('serverless-http');
const knex = require('knex');

const app = express();
app.use(express.json());

// Подключение к базе данных через Transaction Pooler (порт 6543)
const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 7 }
});

// Маршрут для /api/topics
app.get('/api/topics', async (req, res) => {
  try {
    const topics = await db('topics').select('*');
    res.json({ topics });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Маршрут для /api/articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await db('articles').select('*');
    res.json({ articles });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Маршрут для /api/articles/:article_id
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
    console.error('Database error:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Экспортируем функцию для Netlify
module.exports.handler = serverless(app);