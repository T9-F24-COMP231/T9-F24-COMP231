// config/config.js
import dotenv from 'dotenv';
dotenv.config();

export default {
  jwtSecret: 'process.env.JWT_SECRET',
  propertiesDbUri: process.env.PROPERTIES_DB_URI,
  liensDbUri: process.env.LIENS_DB_URI,
  gmailUsername: process.env.GMAIL_USERNAME,
  gmailPassword: process.env.GMAIL_PASSWORD
};
