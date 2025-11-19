import React from 'react';
import PostItem from './PostItem';
import './PostList.css';

const PostList = ({ posts, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="post-list">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="post-list">
        <div className="no-posts">
          <h3>No blog posts yet</h3>
          <p>Be the first to create a blog post!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-list">
      <h2 className="posts-title">Latest Blog Posts ({posts.length})</h2>
      <div className="posts-container">
        {posts.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default PostList;