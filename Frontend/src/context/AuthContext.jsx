// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService'; 
import { userService } from '../services/userService';

// 1. Creamos el contexto (el "megáfono" vacío)
const AuthContext = createContext();

// 2. Creamos el Proveedor (el que tiene los datos reales y los reparte)
export const AuthProvider = ({ children }) => {
  // Ahora user guardará el objeto completo del usuario: { id, email, nickname, profile_picture_url, role, ... }
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Función interna y reutilizable para cargar los datos del usuario real desde el Backend
  const fetchUserData = async () => {
    try {
      // Llamamos a GET /users/me (que ya configuramos en authService)
      const userData = await userService.getMe();
      
      // Guardamos la info real del usuario en el estado global
      setUser(userData); 

    } catch (error) {
      console.error("No se pudieron cargar los datos del usuario en AuthContext:", error);
      
      // Si falla (token inválido/expirado, o server caído), limpiamos todo por seguridad
      logout(); 
    } finally {
      setLoading(false);
    }
  };

  // Cuando la app arranca (o se recarga la página), revisamos si ya había una sesión activa
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay token, vamos a buscar QUIÉN es este usuario
      fetchUserData(); 
    } else {
      // Si no hay token, terminamos de cargar
      setLoading(false); 
    }
  }, []);

  // Función para iniciar sesión a nivel global (modificada para ser async)
  const login = async (token) => {
    localStorage.setItem('token', token);
    // Ya no hacemos setLoading(true) acá para no romper la navegación
    await fetchUserData(); 
  };

  // Función para cerrar sesión (clásica)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false); // Por las dudas si falla fetchUserData
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {/* No renderizamos la app hasta saber el estado de autenticación (evita parpadeos) */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Hook personalizado para usar esto fácilmente en cualquier archivo
export const useAuth = () => useContext(AuthContext);