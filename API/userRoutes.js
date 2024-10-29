// routes/register.js
const express = require('express');
const User = require('./models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();
const router = express.Router();
// Route to register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Store hashed password
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' }); // Send a response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get user's email by username
router.post('/getmail', async (req, res) => {
    console.log('Request body:', req.body); // Log the request body
    const { username } = req.body;

    try {
        const user = await User.findOne({ username });
        console.log('Found user:', user); // Log the user object

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ email: user.email });
    } catch (error) {
        console.error('Error fetching email:', error); // Log any errors
        res.status(500).json({ error: error.message });
    }
});


// Export the router
module.exports = router;
