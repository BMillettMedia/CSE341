const { ObjectId } = require('mongodb');
const db = require('../db/connection');

async function getAll(req, res) {
  try {
    const contacts = await db.getDb().collection('contacts').find().toArray();
    return res.status(200).json(contacts);
  } catch (err) {
    console.error("getAll error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getSingle(req, res) {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const contact = await db.getDb().collection('contacts').findOne({ _id: new ObjectId(id) });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.status(200).json(contact);
  } catch (err) {
    console.error("getSingle error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createContact(req, res) {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "firstName, lastName, email required" });
    }
    const contact = { firstName, lastName, email, favoriteColor, birthday };
    const result = await db.getDb().collection('contacts').insertOne(contact);
    if (result.acknowledged) {
      return res.status(201).json({ id: result.insertedId });
    }
    return res.status(500).json({ message: "Failed to create contact" });
  } catch (err) {
    console.error("createContact error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateContact(req, res) {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const updateFields = req.body;
    const result = await db.getDb()
      .collection('contacts')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("updateContact error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteContact(req, res) {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const result = await db.getDb()
      .collection('contacts')
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    console.error("deleteContact error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };
