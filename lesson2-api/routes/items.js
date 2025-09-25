// routes/items.js
const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../data/seed');

// GET /api/items -> list all items
router.get('/', (req, res) => {
  const items = getAllItems();
  res.json({ total: items.length, items });
});

// GET /api/items/:id -> get one item
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); // ensure numeric
  const item = getItemById(id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST /api/items -> create new item
router.post('/', (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const newItem = createItem({ name, description });
  res.status(201).json(newItem);
});

// PUT /api/items/:id -> update item
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = updateItem(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Item not found' });
  res.json(updated);
});

// DELETE /api/items/:id -> delete item
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = deleteItem(id);
  if (!deleted) return res.status(404).json({ error: 'Item not found' });
  res.status(204).end(); // success, no content
});

module.exports = router;
