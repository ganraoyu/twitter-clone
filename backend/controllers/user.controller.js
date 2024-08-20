const User = require('../models/user.model');

const getUserProfile = async (req, res) => {
    const { username } = req.params.username;
    try { 
        const user = await User.findOne({username}).select('-password');
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
};

const followUnfollowUser = async (req, res) => {
    try{
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id) {
            return res.status(400).json({error: 'You cannot follow yourself'});
        }

        if (!userToModify || !currentUser) {
            return res.status(404).json({message: 'User not found'});
        }

        const isFollow = currerntUser.followig.includes(id);

        if (isFollowing){

        } else{
            
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
};    
module.exports = { getUserProfile, followUnfollowUser };