const Notification = require("../models/notification.model.js");

const getNotifications = async (req, res) => {
    console.log('hi'); // Debugging statement
    try {
        console.log('req.user:', req.user); // Log the req.user object
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userId = req.user._id;

        const notifications = await Notification.find({ to: userId }).populate({
            path: 'from',
            select: 'username profileImg'
        });

        await Notification.updateMany({ to: userId }, { read: true });

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({ to: userId });
        res.status(200).json({ message: 'Notifications deleted' });
    } catch (error) {
        console.error('Error deleting notifications:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getNotifications,
    deleteNotifications
};
