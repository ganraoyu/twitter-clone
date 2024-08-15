const express = require('express');
const { signup, logout, login } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/signup', logout);


module.exports = router;
