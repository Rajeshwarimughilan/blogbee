import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE_URL });

export const adminService = {
  getUsers: async () => {
    return api.get('/admin/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  },
  updateUserRole: async (id, role) => {
    return api.put(`/admin/users/${id}/role`, { role }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  },
  deleteUser: async (id) => {
    return api.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  },
  getPosts: async () => {
    return api.get('/admin/posts', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  },
  deletePost: async (id) => {
    return api.delete(`/admin/posts/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }
};

export default adminService;
