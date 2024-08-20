const jwt = require('jsonwebtoken');

module.exports = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expiration time
    });

    res.cookie('jwt', token, {
        httpOnly: true, // Ensures the cookie is not accessible via JavaScript
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        sameSite: 'strict', // Cookies are only sent in a first-party context
        secure: process.env.NODE_ENV === 'production', // Cookie is sent only over HTTPS in production
    });
};
