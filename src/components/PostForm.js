import React, { useState, useEffect } from 'react';
import './PostForm.css';

const PostForm = ({ onSubmit, editingPost, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || '',
        content: editingPost.content || '',
        author: editingPost.author || ''
      });
    } else {
      setFormData({
        title: '',
        content: '',
        author: ''
      });
    }
  }, [editingPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    } else if (formData.author.length > 50) {
      newErrors.author = 'Author name must be less than 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit(formData);
      if (!editingPost) {
        // Reset form only for new posts
        setFormData({
          title: '',
          content: '',
          author: ''
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      content: '',
      author: ''
    });
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="post-form-container">
      <h2 className="form-title">
        {editingPost ? 'Edit Post' : 'Create New Post'}
      </h2>
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title..."
            className={errors.title ? 'error' : ''}
            maxLength={100}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter your name..."
            className={errors.author ? 'error' : ''}
            maxLength={50}
          />
          {errors.author && <span className="error-message">{errors.author}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog post content here..."
            rows={10}
            className={errors.content ? 'error' : ''}
          />
          {errors.content && <span className="error-message">{errors.content}</span>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>
                <div className="btn-spinner"></div>
                {editingPost ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              editingPost ? 'Update Post' : 'Create Post'
            )}
          </button>
          
          {editingPost && (
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostForm;