const Notification = require("../models/notification.model.js");

const getNotifications = async (req, res) => {
    try{
        const userId = req.user._id;
        const notifications = await Notification.find({to: userId}).populate({
            path: 'from',
            select: 'username profileImg'
        });

        await Notification.updateMany({to: userId}, {read: true});

        res.status(200).json(notifications);
    }catch(error){
        res.status(500).json({message: 'Internal server error'});
    }
};

const deleteNotifications = async (req, res) => {
    try{
        const userId = req.user._id;
        await Notification.deleteMany({to: userId});
        res.status(200).json({message: 'Notifications deleted'});
    }catch(error){
        res.status(500).json({message: 'Internal server error'});
    }
};

module.exports = {
    getNotifications,
    deleteNotifications
};
