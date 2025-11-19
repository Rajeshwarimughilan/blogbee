const express = require('express');
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

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
// @access  Public
router.post('/', createPost);

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Public
router.put('/:id', updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Public
router.delete('/:id', deletePost);

module.exports = router;