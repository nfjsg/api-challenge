// server.js
const express = require('express');
const mongoose = require('mongoose');

// Importing route handlers
const userRoutes = require('./routes/userRoutes');
const thoughtRoutes = require('./routes/thoughtRoutes');

// Creating an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and handling URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Using route handlers for '/api' path
app.use('/api', userRoutes);
app.use('/api', thoughtRoutes);

// Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/socialNetworkDB');

// Setting MongoDB debugging mode
mongoose.set('debug', true);

// Starting the server
app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));
