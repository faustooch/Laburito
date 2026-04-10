// src/components/Header.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../domains/auth/context/AuthContext';

function Header() {
  const { user } = useAuth(); // Sacamos 'logout' de acá
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isHomePage = location.pathname === '/';

  const getInitial = () => {
    return user?.nickname?.charAt(0).toUpperCase() || 'U';
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMobileSearchOpen(false);
    }
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileNavOpen(false);
    }
  };

  const handleLogoClick = (e) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* 1. Logo */}
        <Link to="/" onClick={handleLogoClick} className="group flex items-center gap-1 cursor-pointer select-none">
          <span className="text-xl font-bold text-neutral-50 tracking-tighter transition-colors group-hover:text-white">
            Laburito<span className="text-slate-400 group-hover:animate-pulse">.</span>
          </span>
        </Link>

        {/* 2. Barra de Búsqueda (Desktop) */}
        {user && (
          <div className="hidden md:flex flex-grow justify-center px-8">
            <div className="relative w-full max-w-sm group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-neutral-500 group-focus-within:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Buscar trabajadores o rubros..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-neutral-900/40 border border-neutral-800 text-sm text-neutral-200 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:border-slate-500/60 focus:ring-1 focus:ring-slate-500/20 focus:bg-neutral-900/80 transition-all placeholder:text-neutral-600 shadow-inner"
              />
            </div>
          </div>
        )}

        {/* 3. Navegación central (Desktop, NO logueados) */}
        {!user && isHomePage && (
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <a href="#como-funciona" onClick={(e) => scrollToSection(e, 'como-funciona')} className="text-sm font-medium text-neutral-400 hover:text-slate-300 transition-colors">
              ¿Cómo funciona?
            </a>
            <a href="#oficios" onClick={(e) => scrollToSection(e, 'oficios')} className="text-sm font-medium text-neutral-400 hover:text-slate-300 transition-colors">
              Oficios
            </a>
            <a href="#beneficios" onClick={(e) => scrollToSection(e, 'beneficios')} className="text-sm font-medium text-neutral-400 hover:text-slate-300 transition-colors">
              Beneficios
            </a>
          </nav>
        )}

        {/* 4. Acciones de Usuario y Toggles Mobile */}
        <nav className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Lupa Mobile Toggle */}
              <button 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} 
                className="md:hidden text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileSearchOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  )}
                </svg>
              </button>

              <Link to="/profile" className="relative p-0.5 rounded-full border border-neutral-800 hover:border-slate-500/60 transition-all duration-300 bg-neutral-900 group shadow-sm hover:shadow-slate-500/10">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-800/50">
                  {user?.profile_picture_url ? (
                    <img src={user.profile_picture_url} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xs font-black text-slate-400 uppercase">{getInitial()}</span>
                  )}
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 relative z-10">
              {location.pathname !== '/login' && (
                <Link to="/login" className="hidden sm:block text-sm font-medium text-neutral-400 hover:text-slate-200 transition-colors px-3 py-2">
                  Ingresar
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link to="/register" className="bg-slate-200 text-slate-950 text-sm font-bold px-4 py-1.5 sm:px-5 sm:py-2 rounded-full hover:bg-white transition-all shadow-md hover:shadow-slate-200/20 active:scale-95">
                  Registrate
                </Link>
              )}

              {/* Menú Hamburguesa Mobile (NO logueados) */}
              {!user && isHomePage && (
                <button 
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} 
                  className="md:hidden ml-1 text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileNavOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* --- PANELES DESPLEGABLES MOBILE --- */}
      
      {/* 1. Panel de Búsqueda Mobile */}
      {user && (
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileSearchOpen ? 'max-h-24 border-t border-neutral-800/80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-3 bg-neutral-950/95 backdrop-blur-xl">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Buscar oficios o trabajadores..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-neutral-900/60 border border-neutral-800 text-sm text-neutral-200 pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:border-slate-500/60 focus:ring-1 focus:ring-slate-500/20 transition-all placeholder:text-neutral-600 shadow-inner"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Panel de Navegación Mobile (Landing) */}
      {!user && isHomePage && (
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileNavOpen ? 'max-h-48 border-t border-neutral-800/80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col px-6 py-4 gap-4 bg-neutral-950/95 backdrop-blur-xl">
            <a href="#como-funciona" onClick={(e) => scrollToSection(e, 'como-funciona')} className="text-sm font-bold text-neutral-300 hover:text-white transition-colors">
              ¿Cómo funciona?
            </a>
            <a href="#oficios" onClick={(e) => scrollToSection(e, 'oficios')} className="text-sm font-bold text-neutral-300 hover:text-white transition-colors">
              Oficios Disponibles
            </a>
            <a href="#beneficios" onClick={(e) => scrollToSection(e, 'beneficios')} className="text-sm font-bold text-neutral-300 hover:text-white transition-colors">
              Beneficios
            </a>
            {location.pathname !== '/login' && (
              <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-slate-300 transition-colors pt-2 border-t border-neutral-800/50">
                Ya tengo cuenta (Ingresar)
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;