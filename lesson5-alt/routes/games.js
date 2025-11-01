// routes/games.js
const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');

router.get('/', gamesController.getAllGames);
router.get('/:id', gamesController.getGameById);
router.post('/', gamesController.createGame);
router.put('/:id', gamesController.updateGame);
router.delete('/:id', gamesController.deleteGame);


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized - please log in' });
}

router.post('/', isAuthenticated, gamesController.createGame);
router.put('/:id', isAuthenticated, gamesController.updateGame);
router.delete('/:id', isAuthenticated, gamesController.deleteGame);


module.exports = router;
