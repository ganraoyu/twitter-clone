const User = require('../models/user.model.js');

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded){
            return res.status(401).json({ message: 'Invalid Token' });
        }

        const user = await User.findById(decoded.user_id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = protectRoute;