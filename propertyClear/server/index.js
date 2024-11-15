import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import userRoutes from './routes/user.routes.js';
import propertyRoutes from './routes/property.routes.js';
import lienRoutes from './routes/lien.routes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB Connections
const connectDB = async () => {
  try {
    await mongoose.connect(config.propertiesDbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Properties and User database');
  } catch (err) {
    console.error('Properties DB connection error:', err);
  }
};
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/liens', lienRoutes);
app.use('/api/properties', propertyRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/notification', (req, res) => {
  res.send('Im going to send an email');
});


// import mongoose from 'mongoose';

// const connectDatabases = async () => {
//   try {
//     // Connect to Properties Database
//     await mongoose.connect(config.propertiesDbUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to Properties and User database');

//     // Create a new Mongoose connection for the Liens Database
//     const liensConnection = await mongoose.createConnection(config.liensDbUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to Liens database');

//   } catch (err) {
//     console.error('Database connection error:', err);
//   }
// };

// connectDatabases();
