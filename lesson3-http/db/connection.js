// db/connection.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let _db = null;
let _useLocalData = false;

const initDb = async (callback) => {
  if (_db) {
    console.log('✅ Database already initialized!');
    return callback(null, _db);
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    _db = client.db();
    console.log('✅ Connected to MongoDB Atlas');
    callback(null, _db);
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed, using local sample data instead.');
    _useLocalData = true;
    callback(null, null); // Don't crash the app
  }
};

const getDb = () => {
  if (_useLocalData) return null; // Return null so controllers know to use fallback
  if (!_db) throw Error('Database not initialized!');
  return _db;
};

const isUsingLocalData = () => _useLocalData;

module.exports = { initDb, getDb, isUsingLocalData };
