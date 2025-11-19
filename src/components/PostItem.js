import React from 'react';
import './PostItem.css';
import { useAuth } from '../context/AuthContext';

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

  // determine ownership: compare authorId (preferred) or author username as fallback
  const { user: currentUser } = useAuth();

  const isOwner = (() => {
    if (!currentUser) return false;
    const currentUserId = currentUser._id || currentUser.id || currentUser._id;

    const normalizeId = (val) => {
      if (!val && val !== 0) return null;
      // string
      if (typeof val === 'string') return val;
      // mongoose ObjectId-like
      if (val && typeof val === 'object') {
        if (val._id) return String(val._id);
        if (val.$oid) return String(val.$oid);
        if (typeof val.toString === 'function') return val.toString();
      }
      return String(val);
    };

    const nCurrentId = normalizeId(currentUserId);
    if (post.authorId) {
      const postAuthorId = normalizeId(post.authorId);
      if (postAuthorId && nCurrentId && String(postAuthorId) === String(nCurrentId)) return true;
    }

    // fallback to username comparison (case-insensitive)
    if (post.author && currentUser.username) {
      try {
        return post.author.trim().toLowerCase() === currentUser.username.trim().toLowerCase();
      } catch (e) {
        return post.author === currentUser.username;
      }
    }

    return false;
  })();

  return (
    <div className="post-item">
      <div className="post-header">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-actions">
          {isOwner ? (
            <>
              <button onClick={handleEdit} className="edit-btn">
                ✏️ Edit
              </button>
              <button onClick={handleDelete} className="delete-btn">
                🗑️ Delete
              </button>
            </>
          ) : null}
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