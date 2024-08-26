const Post = require('../models/post.model.js');
const cloudinary = require('cloudinary').v2;
const User = require('../models/user.model.js');
 
const createPost = async (req, res) => {
    try{
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(!text && !img){
            return res.status(400).json({ message: 'Please provide text or image' });
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
        const newPost = new Post({
            user: userId,
            text,
            img,
        });
        
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const deletePost = async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: 'Post not found' });
        }
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: 'You are not authorized to delete this post' });
        }

        if(post.img){
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}
module.exports = { createPost, deletePost };