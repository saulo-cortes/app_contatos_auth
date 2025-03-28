import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-cont-auth.onrender.com',
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;