// src/services/api.js
import axios from 'axios';

const api = axios.create({
  // La URL donde corre tu Uvicorn
  baseURL: 'http://localhost:8000/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;