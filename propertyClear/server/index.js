import config from './config/config.js';
import { getPool } from './config/db.js';

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import cors from 'cors';  // Add this import

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware

app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(cookieParser());

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/users', async (req, res) => {
  const pool = await getPool();
  let users = await pool.query(`SELECT * FROM "User"`);
  console.log(users);
  res.json(users);
});

app.get('/properties', async (req, res) => {
  const pool = await getPool();
  let properties = await pool.query(`SELECT * FROM "Propertie"`);
  console.log(properties);
  res.json(properties.rows);
});

app.get('/notification', (req, res) => {
  
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object

    console.log('barrrrrrr', JSON.stringify(config));

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.gmailUsername,
        pass: config.gmailPassword,
      },
    });

    const mailOptions = {
      from: "timothybcody@gmail.com",
      to: "rthchldshynee@gmail.com",
      subject: "Hello from Nodemailer",
      text: "This is a test email sent using Nodemailer.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  
  main().catch(console.error);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});