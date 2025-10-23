const express = require('express');
const router = express.Router();

router.use('/games', require('./games'));
router.use('/wishlist', require('./wishlist'));

module.exports = router;
//index.js from lesson5-alt/routes double router for different paths of data