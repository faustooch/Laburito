// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Función helper para sacar la inicial del usuario de forma segura
  const getInitial = () => {
    if (user && user.nickname) {
      return user.nickname.charAt(0).toUpperCase();
    }
    return 'U'; // Por defecto si aún no cargó el nombre
  };

  return (
    <header className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* 1. Logo (Izquierda) */}
        <Link to="/" className="text-xl font-bold text-neutral-50 tracking-tight flex-shrink-0">
          Laburito<span className="text-orange-500">.</span>
        </Link>

        {/* 2. Barra de Búsqueda (Centro) */}
        {user && (
          <div className="hidden sm:flex flex-grow max-w-md bg-neutral-900/80 border border-orange-800 rounded-lg px-3 py-1.5 focus-within:border-orange-500/80 transition shadow-inner">
            <svg className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="¿Qué servicio necesitás?" 
              className="bg-transparent text-sm text-neutral-100 focus:outline-none placeholder:text-neutral-600 w-full"
            />
          </div>
        )}

        {/* 3. Navegación Condicional (Derecha) */}
        <div className="flex items-center gap-5 flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="cursor-pointer text-sm font-medium text-neutral-400 hover:text-red-400 transition"
              >
                Cerrar Sesión
              </button>

              {/* Avatar Dinámico */}
              <Link 
                to="/profile"
                className="w-8 h-8 rounded-full bg-orange-600/20 flex items-center justify-center text-sm font-bold text-orange-500 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)] hover:bg-orange-600/30 transition hover:scale-105 overflow-hidden"
                title="Mi Perfil"
              >
                {user?.profile_picture_url ? (
                  <img 
                    src={user.profile_picture_url} 
                    alt="Perfil" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer" /* <- CLAVE para que no se bloqueen las fotos de Google */
                  />
                ) : (
                  getInitial()
                )}
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-orange-500 transition shadow-sm">
                Registrarse
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;