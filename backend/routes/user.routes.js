const express = require('express');
const { protectRoute } = require('../middleware/protectRoute');

const router = express.Router();

router.get('/profile/:username', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getUserProfile);
router.post('/follow/:userId', protectRoute, followUnfollowUser);
router.post('/update', protectRoute, updateUserProfile);

module.exports = router;