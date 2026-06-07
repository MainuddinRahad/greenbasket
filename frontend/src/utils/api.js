import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : process.env.REACT_APP_API_URL || '/api';

const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('greenbasket_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default API;
