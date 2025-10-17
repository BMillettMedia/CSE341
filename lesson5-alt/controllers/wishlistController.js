const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

const getWishlist = async (req, res) => {
  try {
    const db = getDb();
    const wishlist = await db.collection('wishlist').find().toArray();
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { title, reason, priceRange } = req.body;
    if (!title || !reason || !priceRange) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDb();
    const result = await db.collection('wishlist').insertOne({ title, reason, priceRange });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

module.exports = { getWishlist, addToWishlist };
