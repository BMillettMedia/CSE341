const fs = require('fs');
const path = require('path');

// Path to the JSON file
const filePath = path.join(__dirname, 'contacts.json');

// Load contacts from JSON file
const contactsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Convert object into array
const contacts = Object.values(contactsData);

// Return all contacts
const getContacts = () => contacts;

// Return one contact by "id" (using array index + 1)
const getContactById = (id) => {
  const index = parseInt(id, 10) - 1;
  return contacts[index] || null;
};

module.exports = { getContacts, getContactById };
