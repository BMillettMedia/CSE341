// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const itemsRouter = require('./routes/contacts'); // import the items routes

const app = express();

// Middleware
app.use(cors());               // allow cross-origin requests (needed for browser/frontend)
app.use(express.json());       // parse JSON bodies

// Health route (useful for deployment keep-alive checks)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Main API routes
app.use('/api/items', itemsRouter);

// Generic 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
