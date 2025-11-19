const User = require('../models/User');

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

module.exports = { getProfile, searchUsers };