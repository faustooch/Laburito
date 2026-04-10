import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../domains/auth/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // 1. Mientras chequea el token en el backend, no mostramos nada (o un spinner)
  // Esto evita que React eche al usuario en el milisegundo que tarda en leer la sesión al recargar la página.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-500/20 border-t-slate-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Si terminó de cargar y NO hay usuario, lo pateamos a la Home (o al /login)
  if (!user) {
    // El replace=true borra el historial para que no puedan volver atrás con la flecha del navegador
    return <Navigate to="/" replace />; 
  }

  // 3. Si hay usuario, renderizamos la ruta que pidió
  return children ? children : <Outlet />;
};

export default ProtectedRoute;