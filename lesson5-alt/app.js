// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// mount routes
app.use('/', require('./routes'));

// health
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// init DB and start
initDb((err) => {
  if (err) {
    console.error('Failed to start due to DB error:', err);
    process.exit(1);
  } else {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  }
});
