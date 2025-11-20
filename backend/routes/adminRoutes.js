const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser, getAllPostsAdmin, deletePostAdmin } = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// All routes protected: must be logged in and admin
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.put('/users/:id/role', verifyToken, verifyAdmin, updateUserRole);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser);

router.get('/posts', verifyToken, verifyAdmin, getAllPostsAdmin);
router.delete('/posts/:id', verifyToken, verifyAdmin, deletePostAdmin);

module.exports = router;
