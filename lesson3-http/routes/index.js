// routes/index.js
const express = require('express');
const router = express.Router();

// Import the contacts routes
const contactsRoutes = require('./contacts');

// Route for the contacts endpoints
router.use('/contacts', contactsRoutes);

module.exports = router;
