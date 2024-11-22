// config/liensDB.js
import mongoose from 'mongoose';  // Use import instead of require
import dotenv from 'dotenv';  // Use import instead of require

dotenv.config();  // No change needed for dotenv

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

export default liensDB;  // Default export
