const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

// GET all games
const getAllGames = async (req, res) => {
  try {
    const db = getDb();
    const games = await db.collection('games').find().toArray();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

// GET game by ID
const getGameById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: 'Invalid ID format' });

    const db = getDb();
    const game = await db.collection('games').findOne({ _id: new ObjectId(id) });
    if (!game) return res.status(404).json({ error: 'Game not found' });

    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch game' });
  }
};

// POST create new game
const createGame = async (req, res) => {
  try {
    const { title, platform, genre, rating, releaseDate, developer, coverArt } = req.body;
    if (!title || !platform || !genre || !rating || !releaseDate || !developer) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDb();
    const result = await db.collection('games').insertOne({
      title,
      platform,
      genre,
      rating,
      releaseDate,
      developer,
      coverArt
    });

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create game' });
  }
};

// PUT update game
const updateGame = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: 'Invalid ID format' });

    const db = getDb();
    const result = await db.collection('games').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ error: 'Game not found' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to update game' });
  }
};

// DELETE game
const deleteGame = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: 'Invalid ID format' });

    const db = getDb();
    const result = await db.collection('games').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Game not found' });

    res.status(200).json({ message: 'Game deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete game' });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame
};
