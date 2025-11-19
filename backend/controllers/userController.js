const User = require('../models/User');
const Post = require('../models/Post');

// Get public profile and posts for a user (by id)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('username email bio createdAt');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const posts = await Post.find({ authorId: id }).sort({ createdAt: -1 }).populate('likes', 'username');

    res.json({ success: true, data: { user, posts } });
  } catch (error) {
    console.error('Error getUserById:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get profile of current user (protected)
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error getProfile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Search users by username or email (public)
const searchUsers = async (req, res) => {
  try {
    const q = req.query.q || '';
    const regex = new RegExp(q, 'i');
    const users = await User.find({ $or: [{ username: regex }, { email: regex }] }).select('username email');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error('Error searchUsers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getProfile, searchUsers, getUserById };