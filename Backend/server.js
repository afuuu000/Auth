require('dotenv').config({ path: './.env' }); // Load environment variables
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Error connecting to database:', err));

// Routes
app.use('/api/auth', authRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});



