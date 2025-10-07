// controllers/contactsController.js
const { ObjectId } = require('mongodb');
const db = require('../db/connection');

const getAll = async (req, res) => {
  try {
    const contacts = await db.getDb().collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('getAll error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSingle = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const contact = await db.getDb().collection('contacts').findOne({ _id: new ObjectId(id) });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json(contact);
  } catch (err) {
    console.error('getSingle error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const contact = { firstName, lastName, email, favoriteColor, birthday };
    const result = await db.getDb().collection('contacts').insertOne(contact);
    if (result.acknowledged) {
      return res.status(201).json({ id: result.insertedId });
    }
    return res.status(500).json({ message: 'Failed to create contact' });
  } catch (err) {
    console.error('createContact error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateContact = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const updateFields = req.body;
    const result = await db.getDb().collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Contact not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('updateContact error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const result = await db.getDb().collection('contacts').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Contact not found' });
    return res.status(200).json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('deleteContact error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };
