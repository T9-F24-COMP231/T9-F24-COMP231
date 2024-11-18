const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const checkUserRole = require('./middleware/authMiddleware');
const propertyController = require('./controllers/propertyController');
const lienController = require('./controllers/lienController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes for properties with role-based access
app.get('/properties', checkUserRole(['investor', 'agent', 'user']), propertyController.getAllProperties);

// Routes for liens with role-based access
app.get('/liens', checkUserRole(['investor', 'agent', 'user']), lienController.getAllLiens);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});