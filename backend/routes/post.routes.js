const express = require('express');
const { protectRoute } = require('../middleware/protectRoute');
const {createPost, deletePost, commentOnPost, likeUnlikePost} = require('../controllers/post.controller');

const router = express.Router();

router.post('/create', protectRoute, createPost);
router.post('/like/:id', protectRoute, likeUnlikePost);
router.post('/comment/:id', protectRoute, commentOnPost);
router.delete('/:id', protectRoute, deletePost);


module.exports = router;