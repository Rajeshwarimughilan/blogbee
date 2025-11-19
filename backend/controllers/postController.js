const Post = require('../models/Post');

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
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
    const post = await Post.findById(id);
    
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

// Create new post
const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    // Validate required fields
    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and author are required'
      });
    }
    
    const newPost = new Post({
      title,
      content,
      author
    });
    
    const savedPost = await newPost.save();
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: savedPost
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;
    
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, author, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post',
      error: error.message
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPost = await Post.findByIdAndDelete(id);
    
    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: deletedPost
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};