const Post = require('../models/Post');
const User = require('../models/User');

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    // populate likes with usernames
    const posts = await Post.find().sort({ createdAt: -1 }).populate('likes', 'username');
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('likes', 'username');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
      error: error.message
    });
  }
};

// Create new post (requires auth)
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    // Ensure user is available from auth middleware
    const userId = req.userId;
    let authorName = 'Unknown';
    if (userId) {
      const user = await User.findById(userId).select('username');
      if (user) authorName = user.username;
    }

    const newPost = new Post({
      title,
      content,
      author: authorName,
      authorId: userId || null
    });

    const savedPost = await newPost.save();

    res.status(201).json({ success: true, message: 'Post created successfully', data: savedPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Failed to create post', error: error.message });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Ownership check: prefer authorId, fallback to author username
    const userId = req.userId;
    if (post.authorId) {
      if (!userId || post.authorId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden: not post owner' });
      }
    } else {
      // fallback compare username
      const user = userId ? await User.findById(userId).select('username') : null;
      const username = user ? user.username : null;
      if (!username || post.author !== username) {
        return res.status(403).json({ success: false, message: 'Forbidden: not post owner' });
      }
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = Date.now();

    const saved = await post.save();
    res.status(200).json({ success: true, message: 'Post updated successfully', data: saved });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ success: false, message: 'Failed to update post', error: error.message });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const userId = req.userId;
    if (post.authorId) {
      if (!userId || post.authorId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden: not post owner' });
      }
    } else {
      const user = userId ? await User.findById(userId).select('username') : null;
      const username = user ? user.username : null;
      if (!username || post.author !== username) {
        return res.status(403).json({ success: false, message: 'Forbidden: not post owner' });
      }
    }

    await post.remove();
    res.status(200).json({ success: true, message: 'Post deleted successfully', data: post });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: 'Failed to delete post', error: error.message });
  }
};

// Toggle like/unlike for a post (requires auth middleware to set req.userId)
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const likedIndex = post.likes.findIndex(l => l.toString() === userId.toString());
    let action = 'liked';
    if (likedIndex === -1) {
      // add like
      post.likes.push(userId);
    } else {
      // remove like
      post.likes.splice(likedIndex, 1);
      action = 'unliked';
    }

    await post.save();
    const updated = await Post.findById(id).populate('likes', 'username');
    res.json({ success: true, action, data: updated });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
  ,toggleLike
};