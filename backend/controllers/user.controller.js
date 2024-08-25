const Notification = require('../models/notification.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try { 
        const user = await User.findOne({ username }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }

        if (!userToModify || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: 'Unfollowed' });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            // Create and save the notification
            const newNotification = new Notification({
                from: req.user._id,
                to: userToModify._id,
                type: 'follow',
            });

            await newNotification.save();
            res.status(200).json({ message: 'Followed Successfully' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select('following');

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                },
            },
            {
                $sample: { size: 10 },
            },
        ]);

        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 5);

        suggestedUsers.forEach((user) => {
            user.password = null;
        });
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

const updateUser = async (req, res) => {
    const { fullName, username, email,currerntPassword,newPassword, bio, link } = req.body;
    let {profileImg, coverImg} = req.body;

    const userId = req.user._id;

    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        if((!newPassword && currerntPassword) ||(!currerntPassword && newPassword)){
            return res.status(400).json({message: 'Please enter both current and new password'});
        }
        if(currerntPassword && newPassword){
            const isMatch = await bcrypt.compare(currerntPassword, user.password);
            if(!isMatch){
                return res.status(400).json({message: 'Invalid password'});
            }
            if(newPassword.length < 8){
                return res.status(400).json({message: 'Password must be at least 8 characters long'});
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url;
        }

        if (coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullname;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.username = username || user.username;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server error'});
    }
}
module.exports = { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUser };
