const Contact = require('../models/contact');

// GET all contacts
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json({ total: contacts.length, contacts });
  } catch (err) {
    next(err);
  }
};

// GET single contact
const getSingleContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllContacts, getSingleContact };
