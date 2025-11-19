import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE_URL });

export const authService = {
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res;
  },
  login: async (data) => {
    const res = await api.post('/auth/login', data);
    return res;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;