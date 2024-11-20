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


app.get('/properties/:id/history', async (req, res) => {
  const pool = await getPool();
  const propertyId = req.params.id;
  try {
    // Query to get liens and mortgages for the given property
    const history = await pool.query(`
      SELECT 
          p.address,
          json_agg(
              json_build_object(
                  'date', l->>'date',
                  'type', l->>'type',
                  'amount', l->>'amount',
                  'partyTo', l->>'partyTo',
                  'partyFrom', l->>'partyFrom'
              )
          ) AS liens,
          json_agg(
              json_build_object(
                  'amount', m->>'amount',
                  'lender', m->>'lender',
                  'startDate', m->>'startDate',
                  'endDate', m->>'endDate',
                  'interestRate', m->>'interestRate'
              )
          ) AS mortgages
      FROM "Propertie" p
      LEFT JOIN json_array_elements(p.liens::json) l ON true
      LEFT JOIN json_array_elements(p.mortgages::json) m ON true
      WHERE p._id = $1
      GROUP BY p.address;
    `, [propertyId]);

    if (history.rows.length === 0) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(history.rows[0]);
  } catch (error) {
    console.error('Error fetching property history:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/investor/:id/risks', async (req, res) => {
  const pool = await getPool();
  const userId = req.params.id; 

  try {
    // Fetch the user's role and associated properties
    const userResult = await pool.query(`
      SELECT u.role, u.associatedproperties, r.role AS rolename
      FROM "User" u
      JOIN "Role" r ON r._id = u.role
      WHERE u._id = $1;
    `, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    if (user.role !== 2) {
      return res.status(403).json({ error: "Access denied. Only investors can view this data." });
    }

    const associatedProperties = user.associatedproperties ? user.associatedproperties : [];
    if (associatedProperties.length === 0) {
      return res.status(200).json({ risks: [], message: "No associated properties found." });
    }

    const risksResult = await pool.query(`
      SELECT 
          p._id AS property_id,
          p.address,
          json_agg(
              json_build_object(
                  'date', l->>'date',
                  'type', l->>'type',
                  'amount', l->>'amount',
                  'partyTo', l->>'partyTo',
                  'partyFrom', l->>'partyFrom'
              )
          ) AS liens,
          t.finallevies,
          t.lessinterimbilling,
          t.totalamountdue,
          t.duedate
      FROM "Propertie" p
      LEFT JOIN json_array_elements(p.liens::json) l ON true
      LEFT JOIN "Taxe" t ON t.property_id = p._id
      WHERE p._id = ANY($1)
      GROUP BY p._id, t.finallevies, t.lessinterimbilling, t.totalamountdue, t.duedate;
    `, [associatedProperties]);

    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.rolename,
      },
      risks: risksResult.rows,
    });
  } catch (error) {
    console.error("Error fetching investor risks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/users', async (req, res) => {
  const pool = await getPool();
  let users = await pool.query(`SELECT * FROM "User"`);
  console.log(users);
  res.json(users);
});

app.get('/properties', async (req, res) => {
  const pool = await getPool();
  let properties = await pool.query(`
    SELECT * FROM "Propertie"
    `);
  console.log(properties);
  res.json(properties.rows);
});

// propertiesSecure - is ONLY FOR REAL ESTATE AGENT, INVESTOR AND BROCKER

app.get('/propertiesSecure', async (req, res) => {
  const pool = await getPool();
  let properties = await pool.query(`
    SELECT 
    p.*,
    json_agg(
        json_build_object(
            'tax_id', t._id,
            'property_id', t.property_id,
            'finalLevies', t.finalLevies,
            'lessInterimBilling', t.lessInterimBilling,
            'totalAmountDue', t.totalAmountDue,
            'dueDate', t.dueDate
        )
    ) AS taxinfo
FROM "Propertie" p
LEFT JOIN "Taxe" t ON t.property_id = p._id
GROUP BY p._id
    `);
  console.log(properties);
  res.json(properties.rows);
});

app.get('/taxes', async (req, res) =>{
  const pool = await getPool();
  let taxes = await pool.query('SELECT * FROM "Taxe"');
  console.log(taxes);
  res.json(taxes.rows);
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