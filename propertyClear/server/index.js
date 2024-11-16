// import express from 'express';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
import config from './config/config.js';
// import userRoutes from './routes/user.routes.js';
// import propertyRoutes from './routes/property.routes.js';
// import lienRoutes from './routes/lien.routes.js';

// const app = express();
// const PORT = process.env.PORT || 5001;

// // Middleware
// app.use(bodyParser.json());
// app.use(cookieParser());

// // MongoDB Connections
// const connectDB = async () => {
//   try {
//     console.log(config.propertiesDbUri);
//     await mongoose.connect(config.propertiesDbUri, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('Connected to Properties and User database');
//   } catch (err) {
//     console.error('Properties DB connection error:', err);
//   }
// };
// connectDB();

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/liens', lienRoutes);
// app.use('/api/properties', propertyRoutes);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// app.get('/notification', (req, res) => {
//   res.send('Im going to send an email');
// });


// // import mongoose from 'mongoose';

// // const connectDatabases = async () => {
// //   try {
// //     // Connect to Properties Database
// //     await mongoose.connect(config.propertiesDbUri, {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true,
// //     });
// //     console.log('Connected to Properties and User database');

// //     // Create a new Mongoose connection for the Liens Database
// //     const liensConnection = await mongoose.createConnection(config.liensDbUri, {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true,
// //     });
// //     console.log('Connected to Liens database');

// //   } catch (err) {
// //     console.error('Database connection error:', err);
// //   }
// // };

// // connectDatabases();

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
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