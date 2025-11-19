import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Attach token automatically if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(` API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error(' API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(` API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(' API Response Error:', error);
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error(' Backend server is not running or unreachable');
    }
    
    return Promise.reject(error);
  }
);

// Post service methods
export const postService = {
  // Get all posts
  getAllPosts: async () => {
    try {
      const response = await api.get('/posts');
      return response;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get single post by ID
  getPostById: async (id) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Create new post
  createPost: async (postData) => {
    try {
      const response = await api.post('/posts', postData);
      return response;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update existing post
  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`/posts/${id}`, postData);
      return response;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
};

export default postService;