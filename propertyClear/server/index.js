const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/notification', (req, res) => {
  res.send('Im going to send an email');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
