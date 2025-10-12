// app.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { initDb } = require('./db/connection');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', require('./routes'));

// Fallback route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to DB then start server
initDb((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  }
});
