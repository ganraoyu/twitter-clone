const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        } 
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User .findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const login = async (req, res) => {
    res.send('Login route');
};

const logout = async (req, res) => {
    res.send('Logout route');
};

module.exports = { signup, login, logout };
