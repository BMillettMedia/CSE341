const mongoose = require('mongoose');

// Define a schema for contacts
const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  favoriteColor: String,
  birthday:  String
});

// Create a model
const Contact = mongoose.model('Contact', contactSchema);

//double check variable name for duplicate names
module.exports = Contact;
