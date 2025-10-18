// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { connectToServer } = require('./db/connection');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/games', require('./routes/games'));

// Default route
app.get('/', (req, res) => {
  res.send('🎮 Welcome to the Student Game Library API');
});

// Connect to MongoDB, then start server
connectToServer((err) => {
  if (!err) {
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  } else {
    console.error('❌ Failed to start server:', err);
  }
});
