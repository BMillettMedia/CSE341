const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.send("Hal, open the pod bay doors.");
});

app.get('/health', (req, res) => {
  res.send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Web Server is listening at port ' + PORT);
});
//code to say Hello