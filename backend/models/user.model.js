const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [], // Default to an empty array
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [], // Default to an empty array
    }]
}, 
    profileImg: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    link: {
        type: String,
        default: '',
    },

{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
