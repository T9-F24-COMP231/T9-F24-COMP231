const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes.js'); // Ensure this is correctly required

dotenv.config();

const app = express(); // Initialize the app with express
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON
app.use('/api', userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/clearProperty", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/notification', (req, res) => {
  res.send('Im going to send an email');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
