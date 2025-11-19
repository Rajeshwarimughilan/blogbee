const express = require('express');
const router = express.Router();
const { getProfile, searchUsers } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// public search
router.get('/search', searchUsers);

// protected profile
router.get('/me', verifyToken, getProfile);

module.exports = router;