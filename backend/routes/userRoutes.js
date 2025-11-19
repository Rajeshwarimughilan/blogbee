const express = require('express');
const router = express.Router();
const { getProfile, searchUsers, getUserById } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// public search
router.get('/search', searchUsers);

// protected profile
router.get('/me', verifyToken, getProfile);

// public user profile and posts
router.get('/:id', getUserById);

module.exports = router;