// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const { connectToServer } = require('./db/connection');

require('./config/passportConfig'); // load strategies

const app = express();
const PORT = process.env.PORT || 3003;

// Basic middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Session + Passport (MUST be before routes)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true when using https in production
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Swagger UI (if generated)
try {
  const swaggerDocument = require('./swagger-output.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.warn('Swagger docs not found. Run npm run swagger to generate swagger-output.json');
}

// Auth routes first
app.use('/auth', require('./routes/auth'));

// API routes
app.use('/', require('./routes'));

// 404 and error handlers
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Connect DB and start
connectToServer((err) => {
  if (err) {
    console.error('DB connection failed', err);
    process.exit(1);
  } else {
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  }
});

module.exports = app;
