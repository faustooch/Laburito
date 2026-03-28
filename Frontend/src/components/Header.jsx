// src/components/Header.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber en qué ruta estamos
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Verificamos si estamos en la página principal
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitial = () => {
    return user?.nickname?.charAt(0).toUpperCase() || 'U';
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 2. Lógica para el clic en el logo
  const handleLogoClick = (e) => {
    if (isHomePage) {
      // Si ya estamos en la Home, anulamos la navegación normal y scrolleamos arriba
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Si no estamos en la Home, el comportamiento por defecto de <Link to="/"> se ejecuta.
  };

  return (
    <header className="w-full border-b border-neutral-900 bg-neutral-950/70 backdrop-blur-xl sticky left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* 1. Logo */}
        <Link to="/" onClick={handleLogoClick} className="group flex items-center gap-1 cursor-pointer">
          <span className="text-xl font-bold text-neutral-50 tracking-tighter transition-colors group-hover:text-white">
            Laburito<span className="text-orange-500 group-hover:animate-pulse">.</span>
          </span>
        </Link>

        {/* 2. Barra de Búsqueda (Solo Logueados y fuera de Login/Register) */}
        {user && (
          <div className="hidden md:flex flex-grow justify-center px-8">
            <div className="relative w-full max-w-sm group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-neutral-500 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Buscar trabajadores o rubros..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-neutral-900/40 border border-neutral-800 text-sm text-neutral-200 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:border-orange-500/50 focus:bg-neutral-900/80 transition-all placeholder:text-neutral-600"
              />
            </div>
          </div>
        )}

        {/* 3. Navegación central para NO logueados (SOLO EN HOMEPAGE) */}
        {!user && isHomePage && (
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <a href="#como-funciona" onClick={(e) => scrollToSection(e, 'como-funciona')} className="text-sm font-medium text-neutral-400 hover:text-orange-500 transition-colors">
              ¿Cómo funciona?
            </a>
            <a href="#oficios" onClick={(e) => scrollToSection(e, 'oficios')} className="text-sm font-medium text-neutral-400 hover:text-orange-500 transition-colors">
              Oficios
            </a>
            <a href="#beneficios" onClick={(e) => scrollToSection(e, 'beneficios')} className="text-sm font-medium text-neutral-400 hover:text-orange-500 transition-colors">
              Beneficios
            </a>
          </nav>
        )}

        {/* 4. Acciones de Usuario */}
        <nav className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-5">
              <button onClick={handleLogout} className="hidden sm:block text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-red-500 transition-colors cursor-pointer">
                Salir
              </button>
              <Link to="/profile" className="relative p-0.5 rounded-full border border-neutral-800 hover:border-orange-500/50 transition-all duration-300 bg-neutral-900 group">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-orange-500/10">
                  {user?.profile_picture_url ? (
                    <img src={user.profile_picture_url} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xs font-bold text-orange-500">{getInitial()}</span>
                  )}
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 relative z-10">
              {/* Ocultamos los botones de Ingresar/Registrarse si ya estamos en esas páginas */}
              {location.pathname !== '/login' && (
                <Link to="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors px-3 py-2">
                  Ingresar
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link to="/register" className="bg-neutral-50 text-neutral-950 text-sm font-bold px-5 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95">
                  Registrate
                </Link>
              )}
            </div>
          )}
        </nav>

      </div>
    </header>
  );
}

export default Header;