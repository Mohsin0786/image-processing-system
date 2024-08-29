
const { mongoConnect } = require("./utils/dbUtils");
const express = require('express');
const uploadRoutes = require('./routes/uploadRoutes');
const statusRoutes = require('./routes/statusRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use('/api', uploadRoutes);
app.use('/api', statusRoutes);
app.get('/', (req, res) => {
  res.send('Server running smoothly!');
});

mongoConnect(); // MongoDB connection

module.exports =  app  // Export both the app and the io instance
