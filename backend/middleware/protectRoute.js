const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Retrieve user from the database using decoded user_id
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach the user to the request object
        req.user = user;
        
        next();
    } catch (error) {
        console.error('Error in protectRoute middleware:', error); // For debugging
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { protectRoute };
