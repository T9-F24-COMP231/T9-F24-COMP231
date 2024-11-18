const mongoose = require('mongoose');
require('dotenv').config();

const liensDB = mongoose.createConnection(
  process.env.LIENS_DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

liensDB.on('connected', () => {
  console.log('Connected to Liens Database');
});

module.exports = liensDB;