const express = require('express');
const router = express.Router();
const controller = require('../controllers/wishlistController');

router.get('/', controller.getWishlist);
router.post('/', controller.addToWishlist);

module.exports = router;
