const express = require('express');
const { protectRoute } = require('../middleware/protectRoute.js');
const { getUserProfile, followUnfollowUser } = require('../controllers/user.controller.js');
const router = express.Router();

router.get('/profile/:username', protectRoute, getUserProfile);
//router.get('/suggested', protectRoute, getUserProfile);
router.post('/follow/:id', protectRoute, followUnfollowUser);
//router.post('/update', protectRoute, updateUserProfile);

module.exports = router;