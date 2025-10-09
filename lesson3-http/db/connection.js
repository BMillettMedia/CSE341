const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
let _db;

async function initDb(callback) {
  if (_db) {
    console.log("Database already initialized");
    return callback(null, _db);
  }
  try {
    const client = new MongoClient(uri);
    await client.connect();
    _db = client.db();  // default DB
    console.log("✅ Connected to MongoDB");
    callback(null, _db);
  } catch (err) {
    console.error("❌ DB init error:", err);
    callback(err);
  }
}

function getDb() {
  if (!_db) {
    throw new Error("Database not initialized");
  }
  return _db;
}

module.exports = { initDb, getDb };
