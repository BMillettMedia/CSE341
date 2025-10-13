// db/connection.js
const { MongoClient } = require('mongodb');
require('dotenv').config();
let dotenv = require('dotenv');
dotenv.config();

let _db;

const initDb = async (callback) => {
  if (_db) {
    console.log('Database is already initialized!');
    return callback(null, _db);
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    _db = client.db();
    console.log('Connected to MongoDB');
    callback(null, _db);
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    callback(err);
  }
};

const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized. Call initDb first.');
  }
  return _db;
};

module.exports = { initDb, getDb };

