import React, { useState } from 'react';
import './PostItem.css';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';

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

  // likes state - keep local copy for optimistic UI updates
  const [likes, setLikes] = useState(post.likes || []);
  const [showLikers, setShowLikers] = useState(false);
  const hasLiked = (() => {
    if (!currentUser) return false;
    const uid = currentUser._id || currentUser.id;
    return likes.some(l => (l._id ? String(l._id) === String(uid) : String(l) === String(uid)));
  })();

  const handleToggleLike = async () => {
    if (!currentUser) {
      alert('Please log in to like posts');
      return;
    }
    try {
      // optimistic update
      let newLikes;
      if (hasLiked) {
        newLikes = likes.filter(l => String(l._id || l) !== String(currentUser._id || currentUser.id));
      } else {
        newLikes = [...likes, { _id: currentUser._id || currentUser.id, username: currentUser.username }];
      }
      setLikes(newLikes);

      const res = await postService.toggleLike(post._id);
      // backend returns populated likes array
      if (res && res.data && res.data.data && res.data.data.likes) {
        setLikes(res.data.data.likes);
      }
    } catch (err) {
      console.error('Like toggle failed', err);
      // revert optimistic
      setLikes(post.likes || []);
    }
  };

  const toggleShowLikers = () => setShowLikers(s => !s);

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
        <div className="post-likes">
          <button className={`heart-btn ${hasLiked ? 'liked' : ''}`} onClick={handleToggleLike} title={hasLiked ? 'Unlike' : 'Like'}>
            {hasLiked ? '❤️' : '🤍'}
          </button>
          <button className="likes-count" onClick={toggleShowLikers} title="Show who liked">
            {likes.length} {likes.length === 1 ? 'like' : 'likes'}
          </button>
          {showLikers && (
            <div className="likers-list">
              {likes.length === 0 && <div className="no-likes">No likes yet</div>}
              {likes.map(l => (
                <div key={l._id || l} className="liker-item">{l.username || l}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default PostItem;