// db/connection.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Database already initialized!');
    return callback(null, _db);
  }

  MongoClient.connect(uri)
    .then((client) => {
      _db = client.db();
      console.log('Database connected successfully');
      callback(null, _db);
    })
    .catch((err) => {
      console.error('Database connection failed:', err);
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized!');
  }
  return _db;
};

module.exports = { initDb, getDb };
