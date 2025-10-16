// db/connection.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

let _db = null;

async function initDb(callback) {
  if (_db) {
    return callback(null, _db);
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return callback(new Error('MONGODB_URI not set in environment'));
  }
  try {
    const client = new MongoClient(uri);
    await client.connect();
    _db = client.db(); // DB name from URI or default
    console.log('Connected to MongoDB');
    return callback(null, _db);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return callback(err);
  }
}

function getDb() {
  if (!_db) throw new Error('Database not initialized. Call initDb first.');
  return _db;
}

module.exports = { initDb, getDb };
