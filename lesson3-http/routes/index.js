// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/contacts', require('./contacts.js'));

module.exports = router;
