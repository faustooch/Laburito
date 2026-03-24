// src/services/authService.js
import api from './api'; // Asegurate de que tu import a la instancia de axios esté bien

export const authService = {
  // 1. Registro tradicional
  register: async (userData) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  // 2. Login tradicional
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },

  // 3. Login con Google
  googleLogin: async (code) => {
    const response = await api.post('/auth/google', { token: code });
    return response.data;
  },
};