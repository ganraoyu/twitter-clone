const express = require('express');
const { signup, logout, login, getUser } = require('../controllers/auth.controller');
const { protectRoute } = require('../middleware/protectRoute'); // Importing protectRoute correctly
const router = express.Router();

// Define routes with correct handlers
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectRoute, getUser);  // Correct usage of middleware and handler

module.exports = router;
