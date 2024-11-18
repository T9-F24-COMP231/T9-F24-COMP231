const mongoose = require('mongoose');
require('dotenv').config();

const propertiesDB = mongoose.createConnection(
  process.env.PROPERTIES_DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

propertiesDB.on('connected', () => {
  console.log('Connected to Properties Database');
});

module.exports = propertiesDB;