// data/contacts.js
const fs = require('fs');
const path = require('path');

// Path to your JSON file
const filePath = path.join(__dirname, 'contacts.json');

// Helper to read contacts
function readContacts() {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Helper to save contacts
function writeContacts(contacts) {
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
}

// CRUD functions
function getAllContacts() {
  return readContacts();
}

function getContactById(id) {
  const contacts = readContacts();
  return contacts[id] || null;
}

function createContact(id, contact) {
  const contacts = readContacts();
  contacts[id] = contact;
  writeContacts(contacts);
  return contact;
}

function updateContact(id, updates) {
  const contacts = readContacts();
  if (!contacts[id]) return null;

  contacts[id] = { ...contacts[id], ...updates };
  writeContacts(contacts);
  return contacts[id];
}

function deleteContact(id) {
  const contacts = readContacts();
  if (!contacts[id]) return false;

  delete contacts[id];
  writeContacts(contacts);
  return true;
}

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
