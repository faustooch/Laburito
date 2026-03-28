// src/services/statsService.js
import api from './api';

export const statsService = {
  getSystemStats: async () => {
    // La ruta relativa a tu baseURL (ej: http://localhost:8000/api/v1)
    const response = await api.get('/stats/');
    return response.data;
  }
};