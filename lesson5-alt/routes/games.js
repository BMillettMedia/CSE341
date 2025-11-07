// routes/games.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/gamesController');
const { body, validationResult } = require('express-validator');
const authCheck = require('../middleware/authCheck');

// validation middleware for create
const createValidation = [
  body('title').trim().notEmpty().withMessage('title required'),
  body('platform').trim().notEmpty().withMessage('platform required'),
  body('genre').trim().notEmpty().withMessage('genre required'),
  body('rating').trim().notEmpty().withMessage('rating required'),
  body('releaseDate').trim().notEmpty().withMessage('releaseDate required'),
  body('developer').trim().notEmpty().withMessage('developer required'),
  body('coverArt').optional().isURL().withMessage('coverArt must be a valid URL'),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  }
];

// update validation (partial allowed)
const updateValidation = [
  body('coverArt').optional().isURL().withMessage('coverArt must be a valid URL'),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  }
];

// Routes
router.get('/', controller.getAllGames);
router.get('/:id', controller.getGameById);

// Protected write routes
router.post('/', authCheck, createValidation, controller.createGame);
router.put('/:id', authCheck, updateValidation, controller.updateGame);
router.delete('/:id', authCheck, controller.deleteGame);

module.exports = router;
        if (err) return next(err);
        return res.status(200).json({ message: 'Login successful' });