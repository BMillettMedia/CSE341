// controllers/contactsController.js
const { ObjectId } = require('mongodb');
const js2xmlparser = require('js2xmlparser');
const { Parser: Json2csvParser } = require('json2csv');
const path = require('path');
const fs = require('fs');

const { getDb } = require('../db/connection');

// helper: format response according to Accept header or ?format=
function negotiateFormat(req) {
  // explicit query param overrides Accept header
  const queryFormat = (req.query.format || '').toLowerCase();
  if (['json','xml','csv'].includes(queryFormat)) return queryFormat;

  const accept = req.get('Accept') || '';
  if (accept.includes('application/xml') || accept.includes('text/xml')) return 'xml';
  if (accept.includes('text/csv') || accept.includes('application/csv')) return 'csv';
  // default
  return 'json';
}

function sendFormatted(res, req, data, rootName = 'items') {
  const fmt = negotiateFormat(req);
  if (fmt === 'xml') {
    // wrap arrays in a root element
    const body = Array.isArray(data) ? { [rootName.slice(0,-1) || 'item']: data } : data;
    const xml = js2xmlparser.parse(rootName, body);
    res.type('application/xml').status(200).send(xml);
  } else if (fmt === 'csv') {
    // json2csv expects an array
    const list = Array.isArray(data) ? data : [data];
    // remove nested _id object (ensure string)
    const converted = list.map(d => {
      const copy = { ...d };
      if (copy._id) copy._id = copy._id.toString();
      return copy;
    });
    const fields = Object.keys(converted.reduce((acc, cur) => Object.assign(acc, cur), {}));
    const parser = new Json2csvParser({ fields });
    const csv = parser.parse(converted);
    res.type('text/csv').status(200).send(csv);
  } else {
    // JSON
    res.json(data);
  }
}

// GET /contacts
async function getAll(req, res) {
  try {
    const db = getDb();
    const contacts = await db.collection('contacts').find().toArray();
    sendFormatted(res, req, contacts, 'contacts');
  } catch (err) {
    console.error('getAll error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /contacts/:id
async function getById(req, res) {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });
    const db = getDb();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    sendFormatted(res, req, contact, 'contact');
  } catch (err) {
    console.error('getById error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /contacts
async function createContact(req, res) {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'firstName, lastName, email required' });
    }
    const db = getDb();
    const insert = { firstName, lastName, email, favoriteColor, birthday };
    const result = await db.collection('contacts').insertOne(insert);
    return res.status(201).json({ id: result.insertedId.toString() });
  } catch (err) {
    console.error('createContact error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT /contacts/:id
async function updateContact(req, res) {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });
    const db = getDb();
    const update = req.body;
    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Contact not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('updateContact error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /contacts/:id
async function deleteContact(req, res) {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });
    const db = getDb();
    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Contact not found' });
    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteContact error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAll,
  getById,
  createContact,
  updateContact,
  deleteContact
};