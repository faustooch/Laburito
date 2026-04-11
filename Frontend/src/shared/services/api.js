// src/services/api.js
import axios from 'axios';

// Toma la URL de Render si está en producción, o localhost si estás desarrollando
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  // Le concatenamos el /api/v1 a la URL base que venga de la variable
  baseURL: `${API_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;