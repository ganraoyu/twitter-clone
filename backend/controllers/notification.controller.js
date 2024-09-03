const Notification = require("../models/notification.model.js");

const getNotifications = async (req, res) => {
    try{
        const userId = req.user.id;
        const notifications = await Notification.find({to: userId}).populate({
            Path: 'from',
            select: 'username profilePicture'
        });

        await Notification.updateMany({to: userId}, {read: true});

        res.status(200).json(notifications);
    }catch(error){

    }
};

const deleteNotifications = async (req, res) => {
    try{
        const userId = req.user.id;
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
