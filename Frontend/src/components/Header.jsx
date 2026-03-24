// src/components/Header.jsx
import { Link } from 'react-router-dom';

function Header() {
  return (
    // Agregamos backdrop-blur-md y opacidad al fondo (950/80) para el efecto cristal
    <header className="bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50">
      {/* Reducimos el padding (py-3 en lugar de py-4) para que sea más fino */}
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Botones a la izquierda */}
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-sm font-medium text-neutral-400 hover:text-orange-400 transition"
          >
            Iniciar Sesión
          </Link>
          <Link 
            to="/register" 
            // Botón más compacto (px-4 py-2) y bordes coincidentes con el resto (rounded-lg)
            className="bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-orange-500 transition shadow-sm"
          >
            Registrarse
          </Link>
        </div>

        {/* Nombre de la app a la derecha */}
        <Link to="/" className="flex items-center gap-2">
          {/* Texto un poco más chico (text-xl) pero manteniendo la jerarquía */}
          <span className="text-xl font-bold text-neutral-50 tracking-tight">
            Laburito<span className="text-orange-500">.</span>
          </span>
        </Link>

      </nav>
    </header>
  );
}

export default Header;