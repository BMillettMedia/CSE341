// controllers/contactsController.js
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const { getDb, isUsingLocalData } = require('../db/connection');

// Path to local fallback data
const localDataPath = path.join(__dirname, '../data/sampleContacts.json');

/** Helper function to read/write local JSON when MongoDB is unavailable **/
function readLocalData() {
  const data = fs.readFileSync(localDataPath, 'utf8');
  return JSON.parse(data);
}

function writeLocalData(data) {
  fs.writeFileSync(localDataPath, JSON.stringify(data, null, 2));
}

/** ✅ GET all contacts **/
const getAllContacts = async (req, res) => {
  try {
    /*if (isUsingLocalData()) {
      const sampleData = readLocalData();
      return res.status(200).json(sampleData);
    }*/ //local data fallback disabled per assignment instructions

    const db = getDb("WebServices");
    const contacts = await db.collection('Content').find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('❌ Error fetching contacts:', err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

/** ✅ GET contact by ID **/
const getContactById = async (req, res) => {
  try {
    /*if (isUsingLocalData()) {
      const sampleData = readLocalData();
      const contact = sampleData.find((c) => c._id === req.params.id);
      if (!contact) return res.status(404).json({ error: 'Contact not found' });
      return res.status(200).json(contact);
    }*/

    const db = getDb("WebServices");
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });

    const contact = await db.collection('Content').findOne({ _id: new ObjectId(id) });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    res.status(200).json(contact);
  } catch (err) {
    console.error('❌ Error fetching contact:', err);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
};

/** ✅ POST new contact **/
const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (isUsingLocalData()) {
      const data = readLocalData();
      const newContact = {
        _id: (Date.now()).toString(),
        firstName,
        lastName,
        email,
        favoriteColor,
        birthday
      };
      data.push(newContact);
      writeLocalData(data);
      return res.status(201).json({ message: 'Contact added (local mode)', contact: newContact });
    }

    const db = getDb("WebServices");
    const result = await db.collection('Content').insertOne({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday,
    });

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error('❌ Error creating contact:', err);
    res.status(500).json({ error: 'Failed to create contact' });
  }
};

/** ✅ PUT (update) contact **/
const updateContact = async (req, res) => {
  try {
    const id = req.params.id;

    if (isUsingLocalData()) {
      const data = readLocalData();
      const index = data.findIndex((c) => c._id === id);
      if (index === -1) return res.status(404).json({ error: 'Contact not found' });
      data[index] = { ...data[index], ...req.body };
      writeLocalData(data);
      return res.status(204).send();
    }

    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });

    const db = getDb();
    const result = await db.collection('Content').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Contact not found' });
    res.status(204).send();
  } catch (err) {
    console.error('❌ Error updating contact:', err);
    res.status(500).json({ error: 'Failed to update contact' });
  }
};

/** ✅ DELETE contact **/
const deleteContact = async (req, res) => {
  try {
    const id = req.params.id;

    /*if (isUsingLocalData()) {
      const data = readLocalData();
      const newData = data.filter((c) => c._id !== id);
      if (data.length === newData.length) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      writeLocalData(newData);
      return res.status(200).json({ message: 'Contact deleted (local mode)' });
    }*/

    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });

    const db = getDb("WebServices");
    const result = await db.collection('Content').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return res.status(404).json({ error: 'Contact not found' });
    res.status(200).json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('❌ Error deleting contact:', err);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
