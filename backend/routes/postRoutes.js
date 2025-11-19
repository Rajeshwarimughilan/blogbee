const express = require('express');
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike
} = require('../controllers/postController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', getAllPosts);

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', getPostById);

// @route   POST /api/posts
// @desc    Create new post
// @access  Protected
router.post('/', verifyToken, createPost);

// @route   POST /api/posts/:id/like
// @desc    Toggle like/unlike for a post
// @access  Protected (requires auth)
router.post('/:id/like', verifyToken, toggleLike);

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Protected (owner only)
router.put('/:id', verifyToken, updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Protected (owner only)
router.delete('/:id', verifyToken, deletePost);

module.exports = router;