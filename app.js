
const { mongoConnect } = require("./utils/dbUtils");
const express = require('express');
const uploadRoutes = require('./routes/uploadRoutes');
const statusRoutes = require('./routes/statusRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


// Middleware
app.use(express.json());
app.use('/api', uploadRoutes);
app.use('/api', statusRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
mongoConnect(); // MongoDB connection

module.exports =  app  // Export both the app and the io instance
