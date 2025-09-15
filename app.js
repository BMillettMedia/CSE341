const express = require('express');
const app = express();
 
app.get('/', (req, res) => {
  res.send("Hal, open the pod bay doors.");
});
 
app.listen(process.env.PORT || 3000, () => {
  console.log('Web Server is listening at port ' + (process.env.PORT || 3000));
});

//code to say Hello