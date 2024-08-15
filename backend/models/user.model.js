const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String, // Use capital 'S' for String
        unique: true,
    },
    fullName: {
        type: String, // Use capital 'S' for String
        required: true,
    },
    password: {
        type: String, // Use capital 'S' for String
        required: true,
        minlength: 8, // Fixed typo from minLenght to minlength
    },
    email: {
        type: String, // Use capital 'S' for String
        required: true,
        unique: true,
    },
    followers: [{ // Changed from 'follower' to 'followers' and fixed the object declaration
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you want to reference the User model
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); // Export the model
