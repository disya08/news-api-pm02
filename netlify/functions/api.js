const express = require('express');
const serverless = require('serverless-http');
const knex = require('knex');

const app = express();
app.use(express.json());

console.log('Starting API function...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

// Создаем подключение к БД
const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 1 }
});

// Тестовый маршрут для проверки
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Маршрут для /api/topics
app.get('/api/topics', async (req, res) => {
  try {
    console.log('Fetching topics...');
    const topics = await db('topics').select('*');
    console.log(`Found ${topics.length} topics`);
    res.json({ topics });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ msg: 'Internal server error', error: err.message });
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

module.exports.handler = serverless(app);
