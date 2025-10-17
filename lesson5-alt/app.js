const express = require('express');
const cors = require('cors');
const { connectToDb } = require('./db/connection');
const routes = require('./routes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', routes);

const port = process.env.PORT || 3000;

connectToDb((err) => {
  if (!err) {
    app.listen(port, () => console.log(`🎮 Server running on port ${port}`));
  } else {
    console.error('❌ Failed to connect to database');
  }
});
