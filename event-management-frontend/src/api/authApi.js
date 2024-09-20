import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const login = async (email, password) => {
  return await axios.post(`${API_URL}/api/auth/login`, { email, password });
};

export const register = async (name, email, password) => {
  return await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
};
