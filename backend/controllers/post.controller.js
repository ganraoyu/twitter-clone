const Notification = require('../models/notification.model.js');
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

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'You are not authorized to delete this post' });
        }

        if (post.img) {
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log('Error deleting post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const commentOnPost = async (req, res) => {
    try{
        const { text } = req.body;
        const userId = req.user._id;
        const postId = req.params.id;

        if(!text){
            return res.status(400).json({ message: 'Error' });
        }
        const post = await Post.findById(postId);

        if(!postId){
            return res.status(400).json({ message: 'Error' });
        }

        const comment = {
            user: userId,
            text,
        };

        post.comments.push(comment);
        await post.save();
        res.status(201).json(post);
    }catch(error){
        console.log('Error commenting on post:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params; // Rename `post` to `postId` to avoid conflict

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
        } else {
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();
        }

        const notification = new Notification({
            from: userId,
            to: post.user,
            type: 'like',
        });
        await notification.save();

        res.status(200).json(post);
    } catch (error) {
        console.log('Error liking/unliking post:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 

const getAllPosts = async(req, res) => {
    try{
        const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('user', '-password')          // Exclude password from user
    .populate('comments.user', '-password') // Exclude password from comments.user

        if (posts.length === 0){
            return res.status(404).json({ message: 'No posts found' });
        }
        res.status(200).json(posts);
    } catch (error) {
        console.log('Error getting all posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getLikedPosts = async(req, res) => {
    const userId = req.params.id;

    try{
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
        .populate({
            path:'user',
            select: '-password'
        }).populate({
            path:'comments.user',
            select: '-password'
        });
        res.status(200).json(likedPosts);
    } catch (error){
        console.log('Error getting liked posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
}   


const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id; // Ensure req.user is correctly set
        console.log('Authenticated user ID:', userId);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const following = user.following;
        console.log('Following users:', following);

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate('user', '-password')
            .populate('comments.user', '-password');
        
        console.log('Retrieved posts:', feedPosts);

        res.status(200).json(feedPosts);
    } catch (error) {
        console.log('Error getting following posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts };