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

module.exports = { getUserProfile };