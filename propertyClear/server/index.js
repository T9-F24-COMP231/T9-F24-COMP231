import config from './config/config.js';
import { getPool } from './config/db.js';

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import cors from 'cors';

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 5001;


// Middleware

app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(cookieParser());

// Define the authenticateToken middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from "Bearer {token}"
  if (!token) return res.status(401).json({ message: "Access denied, no token provided" });

  try {
      const decoded = jwt.verify(token, "your-secret-key");
      req.user = decoded; // Attach decoded token to the request
      next(); // Proceed to the next middleware or route handler
  } catch (error) {
      res.status(403).json({ message: "Invalid or expired token" });
  }
};

app.get('/secure-endpoint', authenticateToken, (req, res) => {
  res.status(200).json({ message: `Hello user with ID ${req.user.id}` });
});

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/users', async (req, res) => {
  console.log('users endpoint');
  const pool = await getPool();
  let users = await pool.query(`SELECT * FROM "User"`);
  // console.log(users);
  res.json(users.rows);
});

app.get('/properties', async (req, res) => {
  const pool = await getPool();
  let properties = await pool.query(`
    SELECT * FROM "Propertie"
    `);
  // console.log(properties);
  res.json(properties.rows);
});

app.get('/account', authenticateToken, async (req, res) => {
  console.log(req.user.id);
  const pool = await getPool();
  let loggedInUser = await pool.query(`
    SELECT receive_emails FROM "User" WHERE _id = '${req.user.id}'
    `);
  // console.log(loggedInUser);
  res.json(loggedInUser.rows);
});

app.patch('/deactivateUser', authenticateToken, async (req, res) => {
  // console.log(req.user.id);
  // console.log(req.body.receive_emails);

  console.log('444', req.body);

  const userStatus = req.body.userStatus;

  console.log('333', userStatus);

  const pool = await getPool();
  await pool.query(`
    UPDATE "User" SET deactivated = '${userStatus}' WHERE _id = '${req.user.id}';
  `);

  res.json({});
});

app.patch('/account/update', authenticateToken, async (req, res) => {
  // console.log(req.user.id);
  // console.log(req.body.receive_emails);

  const userPreference = req.body.receive_emails;

  const pool = await getPool();
  await pool.query(`
    UPDATE "User" SET receive_emails = '${userPreference}' WHERE _id = '${req.user.id}';
  `);

  if(userPreference == 'YES') {
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
      from: "noreply@propertyclear.com",
      to: "rthchldshynee@gmail.com",
      subject: "PropertyClear email alerts subscribed",
      text: "You will now get email alerts from propertyClear.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });    
  }

  res.json({});
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
  // console.log(properties);
  res.json(properties.rows);
});

app.get('/propertiesSecure/owner', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    const userId = decoded.id; // Assuming the token contains `id` for the user
    const pool = await getPool();

    const query = `
      SELECT 
        p.*,
        COALESCE(json_agg(
            CASE 
                WHEN t.property_id IS NOT NULL THEN
                    json_build_object(
                        'tax_id', t._id,
                        'property_id', t.property_id,
                        'finalLevies', t.finalLevies,
                        'lessInterimBilling', t.lessInterimBilling,
                        'totalAmountDue', t.totalAmountDue,
                        'dueDate', t.dueDate
                    )
                ELSE NULL
            END
        ) FILTER (WHERE t.property_id IS NOT NULL), '[]') AS taxinfo
      FROM "Propertie" p
      LEFT JOIN "Taxe" t ON t.property_id = p._id
      WHERE p.owner_id = $1
      GROUP BY p._id
    `;

    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No properties found for this user' });
    }

    res.json(rows); // Return all matching properties
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error });
  }
});



app.get('/taxes', async (req, res) =>{
  const pool = await getPool();
  let taxes = await pool.query('SELECT * FROM "Taxe"');
  // console.log(taxes);
  res.json(taxes.rows);
});

app.get('/notification', (req, res) => { 
  
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object

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

// User registration route
app.post('/api/users/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Ensure all required fields are present
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const pool = await getPool();
    const result = await pool.query(
      `INSERT INTO "User" (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, hashedPassword, role]
    );

    // Respond with the created user (excluding the password)
    const { password: _, ...userWithoutPassword } = result.rows[0];
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).json({ message: 'Error saving user to database', error });
  }
});

// User login route
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
  }

  try {
      const pool = await getPool();
      const userQuery = await pool.query(
          `SELECT * FROM "User" WHERE email = $1`,
          [email]
      );

      if (userQuery.rows.length === 0) {
          return res.status(404).json({ message: "User not found" });
      }

      const user = userQuery.rows[0];
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        "your-secret-key", // Replace with `process.env.JWT_SECRET` in production
        { expiresIn: "1h" }
    );
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ message: "Sign-in successful", token });
  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Error during login", error });
  }
});

// User logout route
app.post('/api/users/logout', (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

app.post('/api/surveys', async (req, res) => {
  const { full_name, email, date_of_birth, role, technical_problem } = req.body;

  // Validate required fields
  if (!full_name || !email || !date_of_birth || !role || !technical_problem) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const pool = await getPool();

    const query = `
      INSERT INTO surveys (full_name, email, date_of_birth, role, technical_problem)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;

    const values = [full_name, email, date_of_birth, role, technical_problem];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Survey submitted successfully",
      survey: result.rows[0],
    });
  } catch (error) {
    console.error("Error saving survey:", error);
    res.status(500).json({ message: "Failed to save survey data", error });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//Here is reporting section

//Investor
const generateReport = async () => {
  try {
    const response = await fetch('http://localhost:5001/api/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    });

    const result = await response.json();
    if (result.success) {
      // Open the report in a new tab
      window.open(result.filePath, '_blank');
    } else {
      alert('Failed to generate report');
    }
  } catch (error) {
    console.error('Error generating report:', error);
  }
};

// Endpoint for generating a report
app.post('/api/generate-report', (req, res) => {
    const { properties } = req.body;

    // Create a PDF document
    const doc = new PDFDocument();
    const fileName = `report-${Date.now()}.pdf`;
    const filePath = `./reports/${fileName}`;

    // Ensure "reports" directory exists
    if (!fs.existsSync('./reports')) {
        fs.mkdirSync('./reports');
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Add content to the PDF
    doc.fontSize(16).text('Client/Property Report', { align: 'center' });
    doc.moveDown();

    properties.forEach((property, index) => {
        doc.fontSize(12).text(`Property ${index + 1}:`);
        doc.text(`Property ID: ${property._id}`);
        doc.text(`Address: ${property.address}`);
        doc.text(`Owner ID: ${property.owner_id}`);
        doc.moveDown();
    });

    doc.end();

    writeStream.on('finish', () => {
        res.json({ success: true, filePath: `http://localhost:5001/reports/${fileName}` });
    });

    writeStream.on('error', (err) => {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to generate report' });
    });
});

// Serve static files for reports
app.use('/reports', express.static('reports'));
