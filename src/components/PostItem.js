import React from 'react';
import './PostItem.css';

const PostItem = ({ post, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(post);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post._id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="post-item">
      <div className="post-header">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-actions">
          <button onClick={handleEdit} className="edit-btn">
            ✏️ Edit
          </button>
          <button onClick={handleDelete} className="delete-btn">
            🗑️ Delete
          </button>
        </div>
      </div>
      
      <div className="post-meta">
        <span className="post-author">By {post.author}</span>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default PostItem;