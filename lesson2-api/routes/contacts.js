const express = require('express');
const router = express.Router();
const { getAllContacts, getSingleContact } = require('../controllers/contactsController');

// /contacts -> list all
router.get('/', getAllContacts);

// /contacts/:id -> single
router.get('/:id', getSingleContact);

module.exports = router;
