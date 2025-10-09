require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', require('./routes'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

db.initDb((err) => {
  if (err) {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  } else {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  }
});
