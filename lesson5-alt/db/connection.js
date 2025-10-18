// db/connection.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const uri = process.env.MONGODB_URI || 'your fallback local connection string';
const client = new MongoClient(uri);

const connectToServer = async (callback) => {
  try {
    await client.connect();
    db = client.db('WebServices'); // 👈 Database name (as shown in Compass)
    console.log('✅ Connected to MongoDB Atlas');
    return callback();
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    return callback(err);
  }
};

const getDb = () => db;

module.exports = { connectToServer, getDb };
