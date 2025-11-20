const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

// Get all users (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    console.error('getAllUsers error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update user role (admin)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.role = role;
    await user.save();
    res.json({ success: true, data: { _id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error('updateUserRole error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete user (admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // remove user's posts
    const posts = await Post.find({ authorId: id });
    for (const p of posts) {
      // delete image file if exists
      if (p.imageUrl) {
        const filePath = path.join(__dirname, '..', p.imageUrl.replace('/',''));
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
      await p.remove();
    }

    await user.remove();
    res.json({ success: true, message: 'User and their posts removed' });
  } catch (err) {
    console.error('deleteUser error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: get all posts
const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('likes', 'username');
    res.json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    console.error('getAllPostsAdmin error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin delete post
const deletePostAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.imageUrl) {
      try {
        // imageUrl expected like: /uploads/<filename> or uploads/<filename>
        const filename = path.basename(post.imageUrl);
        const filePath = path.resolve(path.join(__dirname, '..', 'uploads', filename));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.debug('deletePostAdmin: file not found, skipping unlink', filePath);
        }
      } catch (e) {
        console.error('deletePostAdmin: failed to unlink file', e);
      }
    }
    // remove post document
    await Post.findByIdAndDelete(id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('deletePostAdmin error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser, getAllPostsAdmin, deletePostAdmin };
