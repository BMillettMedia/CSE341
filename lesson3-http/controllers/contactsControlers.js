// controllers/contactsController.js
const { ObjectId } = require('mongodb');
const { connectToDb } = require('../db/connection');

async function getAllContacts(req, res) {
  try {
    const db = await connectToDb();
    const contacts = await db.collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Error in getAllContacts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getContactById(req, res) {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const db = await connectToDb();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (err) {
    console.error('Error in getContactById:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createContact(req, res) {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = await connectToDb();
    const collection = db.collection('contacts');
    const result = await collection.insertOne({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    });

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error('Error in createContact:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateContact(req, res) {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // You could also validate that the body isn’t empty, etc.
    const updateFields = req.body;

    const db = await connectToDb();
    const result = await db.collection('contacts')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // According to the assignment: return 204 status (No Content) for a successful update
    return res.status(204).send();
  } catch (err) {
    console.error('Error in updateContact:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteContact(req, res) {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const db = await connectToDb();
    const result = await db.collection('contacts')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // According to the assignment: return 200 status for delete
    return res.status(200).json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('Error in deleteContact:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
