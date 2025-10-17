const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectToDb = async (callback) => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(); // uses the default DB from URI
    console.log('✅ Connected to MongoDB');
    callback();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    callback(err);
  }
};

const getDb = () => db;

module.exports = { connectToDb, getDb };
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');