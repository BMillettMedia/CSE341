// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const { connectToServer } = require('./db/connection');

require('./auth/passportConfig'); // 🔐 Load Passport config

const app = express();
const PORT = process.env.PORT || 3003;

// ---------- MIDDLEWARE SETUP ----------

// Parse incoming JSON
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Configure session middleware BEFORE passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// ---------- SWAGGER DOCUMENTATION ----------

try {
  const swaggerDocument = require('./swagger-output.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('✅ Swagger UI route loaded at /api-docs');
} catch (e) {
  console.warn('⚠️ Swagger file not found. Run "npm run swagger" first.');
}

// ---------- ROUTES ----------

// Authentication routes (Google OAuth)
app.use('/auth', require('./routes/auth'));

// Main API routes (Games, Users, etc.)
app.use('/', require('./routes'));

// ---------- ERROR HANDLING ----------

// Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// ---------- DATABASE CONNECTION + SERVER START ----------

connectToServer((err) => {
  if (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  } else {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  }
});

module.exports = app;
