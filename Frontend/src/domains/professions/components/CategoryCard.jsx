// src/components/CategoryCard.jsx
import { getCategoryImage } from '../utils/categoryImages';

function CategoryCard({ category, onClick }) {
  return (
    <div 
      onClick={() => onClick(category.name)} 
      className="group min-w-[200px] md:min-w-[260px] aspect-[4/5] relative flex flex-col items-start justify-end p-6 rounded-[2rem] border border-neutral-800 hover:border-slate-500/40 transition-all duration-500 cursor-pointer overflow-hidden hover: hover:-500/10 hover:-translate-y-2 bg-neutral-950 flex-shrink-0"
    >
      {/* Capa 1: Imagen de fondo con zoom cinematográfico */}
      <img 
        src={getCategoryImage(category.name)} 
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 group-hover:blur-[2px]" 
      />

      {/* Capa 2: Gradiente oscuro de base (Asegura que el texto SIEMPRE se lea) */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent opacity-90 group-hover:from-neutral-950 group-hover:via-neutral-900/90 transition-all duration-500 z-0"></div>
      
      {/* Capa 3: Resplandor naranja sutil en hover (Modo fusión) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none mix-blend-overlay"></div>
      
      {/* Capa 4: Contenido interactivo */}
      <div className="z-20 w-full relative transform transition-transform duration-500 group-hover:-translate-y-1">
        <span className="block text-xl font-black text-neutral-100 tracking-tight group-hover:text-white drop- transition-colors leading-tight">
          {category.name}
        </span>
        
        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Explorar
          </span>
          {/* Flecha cinética que se mueve a la derecha */}
          <svg className="w-3.5 h-3.5 text-slate-500 transform transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </div>
      </div>
      
      {/* Capa 5: Brillo interno (Highlight de cristal) */}
      <div className="absolute inset-0 rounded-[2rem] border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"></div>
    </div>
  );
}

export default CategoryCard;