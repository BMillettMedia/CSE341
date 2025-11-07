// controllers/gamesController.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

const getAllGames = async (req, res, next) => {
  try {
    const db = getDb();
    const games = await db.collection('GameContent').find().toArray();
    res.json(games);
  } catch (err) { next(err); }
};

const getGameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();
    let query;
    if (ObjectId.isValid(id)) query = { _id: new ObjectId(id) };
    else query = { _id: id };
    const game = await db.collection('GameContent').findOne(query);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (err) { next(err); }
};

const createGame = async (req, res, next) => {
  try {
    const db = getDb();
    const toInsert = req.body;
    const result = await db.collection('GameContent').insertOne({
      ...toInsert,
      createdBy: req.user ? req.user.id : null,
      createdAt: new Date()
    });
    res.status(201).json({ id: result.insertedId });
  } catch (err) { next(err); }
};

const updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();
    let query;
    if (ObjectId.isValid(id)) query = { _id: new ObjectId(id) };
    else query = { _id: id };

    const result = await db.collection('GameContent').updateOne(query, { $set: req.body });
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Game not found' });
    res.status(204).send();
  } catch (err) { next(err); }
};

const deleteGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();
    let query;
    if (ObjectId.isValid(id)) query = { _id: new ObjectId(id) };
    else query = { _id: id };

    const result = await db.collection('GameContent').deleteOne(query);
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Game not found' });
    res.json({ message: 'Game deleted' });
  } catch (err) { next(err); }
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame
};
