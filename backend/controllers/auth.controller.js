const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const generateTokenAndSetCookie = require('../library/utilities/generateToken.js');

const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        // Ensure password is provided
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        } 
        
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if(password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        console.log('Generated salt:', salt);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Hashed password:', hashedPassword);

        // Create a new user
        const newUser = new User({  
            username,
            fullName,
            email,
            password: hashedPassword,
        });
        
        // Save the new user and send a response
        await newUser.save();
        if (newUser._id) {
            generateTokenAndSetCookie(newUser._id, res); 
            
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
            });
        } else {
            return res.status(400).json({ message: 'User not created' });
        }
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = user ? await bcrypt.compare(password, user?.password) : false;
        if(!user || !isPasswordCorrect ){
            return res.status(400).json({ message: 'Invalid user or password' });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(400).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 }); // Corrected the syntax here
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(400).json({ message: error.message });
    }
};


const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._Id);
    }
    catch (error) {
        console.error('Error during getUser:', error);
        return res.status(400).json({ message: error.message });
    }
}    
    
module.exports = { signup, login, logout, getUser };
