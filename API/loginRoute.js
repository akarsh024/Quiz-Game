// routes/register.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./models/user');
require('dotenv').config();
const router = express.Router();
const jwt = require('jsonwebtoken');

// Add this line at the beginning of your file
const SECRET_KEY = process.env.SECRET_KEY; // Replace with a strong secret

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        // Send both token and userID to client
        res.json({ token, userID: user._id }); // Include userID in the response
    } catch (error) {
        console.error('Login error:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error logging in.' }); // Respond with a JSON error message
    }
});

module.exports = router;
