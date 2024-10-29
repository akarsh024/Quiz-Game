const express = require('express');
const User = require('./models/user'); // Adjust the path
const router = express.Router();

// Middleware to validate username and amount
const validateInput = (req, res, next) => {
    const { username, amount } = req.body;
    if (!username || typeof username !== 'string') {
        return res.status(400).json({ message: 'Invalid username' });
    }
    if (amount <= 0 || typeof amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
    next();
};

// Route to get the user's wallet balance using username
router.get('/wallet/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ wallet: user.wallet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to add funds to the wallet using username
router.post('/wallet/add', validateInput, async (req, res) => {
    const { username, amount } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.wallet += amount; // Update wallet balance
        await user.save(); // Save the updated user

        res.status(200).json({ message: 'Funds added successfully', wallet: user.wallet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to withdraw funds from the wallet using username
router.post('/wallet/withdraw', validateInput, async (req, res) => {
    const { username, amount } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.wallet < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        user.wallet -= amount; // Deduct from wallet balance
        await user.save(); // Save the updated user

        res.status(200).json({ message: 'Withdrawal successful', wallet: user.wallet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export the router
module.exports = router;
