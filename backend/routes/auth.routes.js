const express = require('express');
const { signup, logout, login, getUser } = require('../controllers/auth.controller');
const protectRoute = require('../middleware/protectRoute');
const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.get('/me', protectRoute, getUser);

module.exports = router;
