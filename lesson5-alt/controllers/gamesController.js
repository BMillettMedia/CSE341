// controllers/gamesController.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

// ✅ GET all games
const getAllGames = async (req, res) => {
  try {
    const db = getDb();
    const games = await db.collection('GameContent').find().toArray();
    res.status(200).json(games);
  } catch (err) {
    console.error('❌ Error fetching games:', err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

// ✅ GET game by ID
const getGameById = async (req, res) => {
  try {
    const db = getDb();
    const id = req.params.id;

    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    const game = await db.collection('GameContent').findOne(query);

    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json(game);
  } catch (err) {
    console.error('❌ Error fetching game:', err);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
};

// ✅ POST new game
const createGame = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('GameContent').insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add game' });
  }
};

// ✅ PUT (update) game
const updateGame = async (req, res) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const result = await db
      .collection('GameContent')
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: 'Game not found' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to update game' });
  }
};

// ✅ DELETE game
const deleteGame = async (req, res) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const result = await db.collection('GameContent').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Game not found' });

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete game' });
  }
};

module.exports = { 
  getAllGames, 
  getGameById, 
  createGame, 
  updateGame, 
  deleteGame };
