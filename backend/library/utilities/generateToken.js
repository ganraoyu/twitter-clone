const jwt = require('jsonwebtoken');

module.exports = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        sameSite:'strict',
        secure: process.env.NODE_ENV === 'development',
    });
};
