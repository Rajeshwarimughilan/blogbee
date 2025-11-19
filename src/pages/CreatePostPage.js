import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { postService } from '../services/postService';
import './CreatePostPage.css';

const CreatePostPage = () => {
  const navigate = useNavigate();

  const handleCreatePost = async (formData) => {
    try {
      await postService.createPost(formData);
      alert('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
      throw error; // Re-throw to keep form in loading state if needed
    }
  };

  return (
    <div className="create-post-page">
      <header className="create-header">
        <div className="header-content">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
          <h1>Create New Post</h1>
          <p>Share your thoughts and ideas with the BlogBee community</p>
        </div>
      </header>

      <main className="create-content">
        <PostForm onSubmit={handleCreatePost} />
      </main>
    </div>
  );
};

export default CreatePostPage;