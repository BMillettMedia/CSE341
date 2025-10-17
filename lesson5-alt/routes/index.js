const express = require('express');
const router = express.Router();

router.use('/games', require('./games'));
router.use('/wishlist', require('./wishlist'));

module.exports = router;
