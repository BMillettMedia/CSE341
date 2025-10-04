// server.js
const express = require('express');
const dotenv = require('dotenv');
const contactsRoutes = require('./routes/contacts.js');

dotenv.config();

const app = express();

app.use(express.json());

// Use the contacts routes
app.use('/contacts', contactsRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

//professor solution?
// app.use('/api/contacts', contactsRoutes);
