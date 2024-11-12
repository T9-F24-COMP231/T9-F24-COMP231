require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

// Import controllers
const propertyController = require('./controllers/propertyController');
const lienController = require('./controllers/lienController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes for properties
app.get('/properties', propertyController.getAllProperties);

// Routes for liens
app.get('/liens', lienController.getAllLiens);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});