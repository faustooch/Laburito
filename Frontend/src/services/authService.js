// src/services/authService.js
import api from './api';

export const authService = {
  // Función para registrar un nuevo usuario
  register: async (userData) => {
    // userData debe ser: { nickname, email, password }
    const response = await api.post('/users/', userData);
    return response.data;
  },

  // Función para iniciar sesión (OAuth2 requiere form-data)
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email); // FastAPI usa 'username' para el campo de login
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data; // Aquí vendrá el access_token
  }
};