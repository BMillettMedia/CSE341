// db/connection.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
let client;
let db = null;

async function initDb(callback) {
  if (!uri) {
    return callback(new Error('MONGODB_URI not set in environment'));
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(); // use DB defined in URI or default DB
    console.log('✅ Connected to MongoDB');
    return callback();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    return callback(err);
  }
}

function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb first.');
  return db;
}

module.exports = { initDb, getDb };
