// routes/games.js
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

// ✅ Helper function for validation
function validateGame(game) {
  const requiredFields = ['title', 'genre', 'platform', 'developer', 'releaseDate', 'rating', 'price'];
  for (const field of requiredFields) {
    if (!game[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null; // All good
}

/**
 * 🧠 LESSON CONCEPT:
 * Each route below demonstrates an important REST API principle:
 * - GET = Retrieve data
 * - POST = Create data
 * - PUT = Update existing data
 * - DELETE = Remove data
 * 
 * We also use proper validation and error handling patterns.
 */

// ✅ GET all games
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const games = await db.collection('GameContent').find().toArray();
    res.status(200).json(games);
  } catch (err) {
    next(err);
  }
});

// ✅ GET a single game by ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid game ID format' });
    }

    const db = getDb();
    const game = await db.collection('GameContent').findOne({ _id: new ObjectId(id) });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json(game);
  } catch (err) {
    next(err);
  }
});

// ✅ POST (create) a new game
router.post('/', async (req, res, next) => {
  try {
    const newGame = req.body;

    // Validate all required fields
    const validationError = validateGame(newGame);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const db = getDb();
    const result = await db.collection('GameContent').insertOne(newGame);
    res.status(201).json({ message: 'Game added successfully', id: result.insertedId });
  } catch (err) {
    next(err);
  }
});

// ✅ PUT (update) a game by ID
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid game ID format' });
    }

    const updatedGame = req.body;
    const validationError = validateGame(updatedGame);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const db = getDb();
    const result = await db.collection('GameContent').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedGame }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(204).send(); // No Content (successful update)
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE a game by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid game ID format' });
    }

    const db = getDb();
    const result = await db.collection('GameContent').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
