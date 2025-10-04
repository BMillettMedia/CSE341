// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connection');

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', require('./routes'));

// Error handling for invalid routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to database then start server
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on port ${port}`);
    });
  }
});
