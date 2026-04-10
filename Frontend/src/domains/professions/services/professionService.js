// src/services/professionService.js
import api from '../../../shared/services/api'; // Asegurate de que esta ruta apunte a tu instancia de Axios

export const professionService = {
  getProfessions: async () => {
    // Si tu backend tiene un prefijo, ajustá la URL (ej: '/api/v1/professions')
    const response = await api.get('/professions');
    return response.data;
  }
};