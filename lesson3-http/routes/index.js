// routes/index.js
const express = require('express');
const router = express.Router();

// Import the contacts routes
const contactsRoutes = require('./contacts');

// Route for the contacts endpoints
router.use('/contacts', contactsRoutes);

// Optional: Root route for base URL
router.get('/', (req, res) => {
  res.send('Welcome to the Lesson 3 API! Use /contacts to access the contacts collection.');
});

module.exports = router;
