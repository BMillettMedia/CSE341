// controllers/contactsController.js
const contactsData = require('../data/contacts');

// GET all contacts
function listContacts(req, res, next) {
  try {
    const contacts = contactsData.getAllContacts();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
}

// GET single contact
function getContact(req, res, next) {
  try {
    const contact = contactsData.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
}

// POST new contact
function createContact(req, res, next) {
  try {
    const { id, firstName, lastName, email, favoriteColor, birthday } = req.body;
    if (!id || !firstName || !lastName) {
      return res.status(400).json({ error: 'id, firstName, and lastName are required' });
    }
    const newContact = { firstName, lastName, email, favoriteColor, birthday };
    contactsData.createContact(id, newContact);
    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
}

// PUT update contact
function updateContact(req, res, next) {
  try {
    const updated = contactsData.updateContact(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE contact
function deleteContact(req, res, next) {
  try {
    const deleted = contactsData.deleteContact(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
};
