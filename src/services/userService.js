import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE_URL });

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/me', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res;
  },
  search: async (q) => {
    const res = await api.get('/users/search', { params: { q } });
    return res;
  }
  ,
  // Get public user profile + posts by user id
  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res;
  }
};

export default userService;