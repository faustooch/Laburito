// src/components/Footer.jsx
import { useNavigate } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 mt-auto pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Contenido Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          
          {/* Marca y Propósito */}
          <div className="max-w-sm">
            <h2 className="text-xl font-black text-neutral-50 mb-3 tracking-tighter">
              Laburito<span className="text-slate-500">.</span>
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Plataforma para conectar con trabajadores en Argentina.
            </p>
          </div>

          {/* Navegación Rápida */}
          <div className="flex gap-8">
            <button 
              onClick={() => navigate('/terms')} 
              className="text-sm font-medium text-neutral-400 hover:text-slate-500 transition-colors cursor-pointer"
            >
              Términos y Condiciones
            </button>
          </div>
          
        </div>

        {/* Línea final de Copyright y Autor */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-center md:text-left">
            <p className="text-[11px] text-neutral-600 font-medium uppercase tracking-widest">
              &copy; {year} Laburito. Todos los derechos reservados.
            </p>
          </div>
          
          {/* Créditos y GitHub */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">Desarrollado por <a href='https://portfolio-fch.netlify.app/'><strong className="text-neutral-300">Fausto Chiacchietta </strong></a></span>
            <a 
              href="https://github.com/faustooch" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-all cursor-pointer hover:"
              title="Visitar perfil de GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;