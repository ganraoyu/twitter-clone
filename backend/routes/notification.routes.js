const express = require('express');
const { protectRoute } = require('../middleware/protectRoute');
const { getNotifications, deleteNotifications } = require('../controllers/notification.controller.js');
const router = express.Router();

// Define routes
router.get('/', protectRoute, getNotifications);
router.delete('/', protectRoute, deleteNotifications);

module.exports = router;
