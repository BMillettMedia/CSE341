// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db/connection');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const app = express();
const PORT = process.env.PORT || 3002;

app
  .use(cors())
  .use(express.json());

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use('/', require('./routes'));

// Simple root
app.get('/', (req, res) => {
  res.send('Welcome to the Contacts API. Visit /api-docs for documentation.');
});

// Initialize DB then start
db.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
  }
});
