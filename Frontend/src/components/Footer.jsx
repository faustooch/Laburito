// src/components/Footer.jsx
import { useNavigate } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 mt-auto pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1: Marca y Propósito */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl font-black text-neutral-50 mb-4 tracking-tighter">
              LABURITO<span className="text-orange-500">.</span>
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              Conectando el talento local con las necesidades de tu hogar. 
              La plataforma más segura para encontrar profesionales en Argentina.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Plataforma</h3>
            <ul className="space-y-4">
              <li><button onClick={() => navigate('/search')} className="text-sm text-neutral-500 hover:text-orange-500 transition-colors cursor-pointer">Buscar Profesionales</button></li>
              <li><button onClick={() => navigate('/become-worker')} className="text-sm text-neutral-500 hover:text-orange-500 transition-colors cursor-pointer">Ofrecer Servicios</button></li>
              <li><button onClick={() => navigate('/featured')} className="text-sm text-neutral-500 hover:text-orange-500 transition-colors cursor-pointer">Trabajadores Destacados</button></li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Ayuda</h3>
            <ul className="space-y-4">
              <li><button className="text-sm text-neutral-500 hover:text-orange-500 transition-colors cursor-pointer">Cómo funciona</button></li>
              <li><button className="text-sm text-neutral-500 hover:text-orange-500 transition-colors cursor-pointer">Centro de Seguridad</button></li>
              <li><button className="text-sm text-neutral-500 hover:text-orange-500 transition-colors cursor-pointer">Términos y Condiciones</button></li>
            </ul>
          </div>

          {/* Columna 4: Newsletter / Contacto */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Contacto</h3>
            <p className="text-sm text-neutral-500 mb-4 italic">¿Tenés dudas? Escribinos:</p>
            <a 
              href="mailto:soporte@laburito.com" 
              className="inline-block px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-300 hover:border-orange-500/50 transition-all shadow-sm"
            >
              soporte@laburito.com
            </a>
          </div>
        </div>

        {/* Línea final de Copyright */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-neutral-600 font-medium uppercase tracking-widest">
            &copy; {year} Laburito Argentina. Hecho con <span className="text-orange-500">♥</span> en Córdoba.
          </p>
          
          <div className="flex items-center gap-6">
            {/* Redes Sociales Mockup */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-orange-500 hover:border-orange-500/30 transition-all cursor-pointer">
                <i className="fab fa-instagram text-xs"></i>
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-orange-500 hover:border-orange-500/30 transition-all cursor-pointer">
                <i className="fab fa-twitter text-xs"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;