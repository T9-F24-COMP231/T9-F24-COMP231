// config/propertiesDB.js
import mongoose from 'mongoose';  // Using import instead of require
import dotenv from 'dotenv';

dotenv.config();

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

export default propertiesDB;  // Default export
