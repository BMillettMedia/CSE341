// routes/contacts.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactsController');

router.get('/', controller.getAll);            // GET /contacts
router.get('/:id', controller.getSingle);      // GET /contacts/:id
router.post('/', controller.createContact);    // POST /contacts
router.put('/:id', controller.updateContact);  // PUT /contacts/:id
router.delete('/:id', controller.deleteContact); // DELETE /contacts/:id

module.exports = router;
