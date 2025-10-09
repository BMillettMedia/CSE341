// db/connection.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectToDb() {
  if (db) {
    return db;
  }
  await client.connect();
  db = client.db();  // uses the default database name from the URI or set it explicitly
  console.log('✅ MongoDB connected');
  return db;
}

module.exports = { connectToDb };
