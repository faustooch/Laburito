import api from '../../../shared/services/api';

export const reviewService = {
  createReview: async (workerId, reviewData) => {
    // Cambiamos la ruta para que coincida con el backend: /reviews/workers/{id}
    const response = await api.post(`/reviews/workers/${workerId}`, reviewData);
    return response.data;
  },
  deleteReview: async (reviewId) => {
    // La ruta debe coincidir con tu router de FastAPI: /reviews/{id}
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }
};