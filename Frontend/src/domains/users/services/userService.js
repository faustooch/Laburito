import api from '../../../shared/services/api';

export const userService = {
    // 4. Obtener mi propio usuario
  getMe: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // 5. Actualizar datos personales (el nombre)
  updateUser: async (userId, data) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // 6. Actualizar perfil de trabajador
  updateWorkerProfile: async (data) => {
    const token = localStorage.getItem('token');
    const response = await api.put('/users/me/worker-profile', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  uploadProfilePicture: async (formData) => {
    const response = await api.post('/users/me/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Sube los datos por primera vez para convertir al cliente en trabajador
  createWorkerProfile: async (workerData) => {
    // Generalmente esto es un POST, a diferencia del PUT de actualizar
    const response = await api.post('/users/me/become-worker', workerData);
    return response.data;
  },
  getTopWorkers: async () => {
    // Llamamos a un endpoint que devuelva trabajadores con su promedio de rating
    const response = await api.get('/users/workers/featured');
    return response.data;
  },

  searchWorkers: async (params) => {
  // Mapeamos 'minRating' de React a 'min_rating' de FastAPI si es necesario
  const formattedParams = {
    q: params.q || "",
    city: params.city || "",
    profession: params.profession || "",
    min_rating: params.minRating || 0 // <-- Ojo con el nombre aquí
  };
  
  const query = new URLSearchParams(formattedParams).toString();
  const response = await api.get(`/users/workers/search?${query}`);
  return response.data;
},

// src/services/userService.js
getWorkerById: async (id) => {
  const response = await api.get(`/users/workers/${id}`);
  return response.data;
},

downgradeToClient: async () => {
    try {
      // Utilizamos el método DELETE por convención REST para eliminar un recurso
      const response = await api.delete('/users/me/worker-profile');
      return response.data;
    } catch (error) {
      console.error("Error crítico al dar de baja el perfil de trabajador:", error);
      throw error.response?.data || error.message;
    }
  },
};