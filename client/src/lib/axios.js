import axios from 'axios';

const api = axios.create({
  baseURL: 'https://intervue-io-assignment-5wp1.onrender.com/api', // Your backend URL
});

// Interceptor to add the token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;