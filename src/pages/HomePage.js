import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import { postService } from '../services/postService';
import './HomePage.css';
import logo from '../logo.png';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await postService.getAllPosts();
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowEditForm(true);
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await postService.updatePost(editingPost._id, formData);
      
      // Update the post in the list
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === editingPost._id ? response.data.data : post
        )
      );
      
      setEditingPost(null);
      setShowEditForm(false);
      alert('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await postService.deletePost(postId);
      
      // Remove the post from the list
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setShowEditForm(false);
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header-inner">
          <div className="header-left">
            <img src={logo} alt="BlogBee Logo" className="bee-logo" />
          </div>
          <div className="header-right">
            <h1>BlogBee</h1>
            <p>Share your thoughts with the world</p>
            <Link to="/create" className="create-post-btn">
               Write New Post
            </Link>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={fetchPosts} className="retry-btn">
            🔄 Retry
          </button>
        </div>
      )}

      {showEditForm && (
        <div className="edit-form-section">
          <PostForm
            onSubmit={handleUpdate}
            editingPost={editingPost}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      <main className="home-content">
        <PostList
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default HomePage;