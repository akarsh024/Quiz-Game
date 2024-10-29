// app.js or server.js
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./userRoutes.js');
const loginRoute = require('./loginRoute.js');
const questionsReportsRoute = require('./questionsRoute.js');
const walletRoutes = require('./walletRoute') // Import the questions and reports route
require('dotenv').config();

const app = express();
const Mongo_URI = process.env.Mongo_URI;
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(Mongo_URI, {

})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Use the user and login routes
app.use('/', userRoute);
app.use('/', loginRoute);
app.use('/api', questionsReportsRoute); 
app.use('/api', walletRoutes); // Use the questions and reports route

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
