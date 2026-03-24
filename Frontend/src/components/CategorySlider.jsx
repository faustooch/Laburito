// src/components/CategorySlider.jsx
import { useRef } from 'react';
import { getCategoryImage } from '../utils/categoryImages'; 

function CategorySlider({ professions }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollBy({ left: -350, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-16 relative">
      <div className="flex items-end justify-between mb-8 px-1">
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-neutral-50 tracking-tight">
            Explorar por <span className="text-orange-500">Categoría</span>
          </h3>
          <p className="text-sm text-neutral-500 mt-1 font-medium">
            Encontrá al profesional ideal para tu necesidad
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-orange-500 hover:border-orange-500/50 transition-all cursor-pointer backdrop-blur-sm shadow-sm active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-orange-500 hover:border-orange-500/50 transition-all cursor-pointer backdrop-blur-sm shadow-sm active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory select-none no-scrollbar px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {professions.map((cat) => (
          <div 
            key={cat.id} 
            // ELIMINADO: hover:-translate-y-1 para que no suba
            className="group min-w-[200px] md:min-w-[260px] aspect-[4/5] snap-start relative flex flex-col items-start justify-end p-6 rounded-3xl border border-neutral-800 hover:border-orange-500/50 transition-all duration-500 cursor-pointer overflow-hidden shadow-2xl bg-neutral-950"
          >
            
            <img 
              src={getCategoryImage(cat.name)} 
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:blur-[1px]" 
            />

            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent opacity-95 group-hover:opacity-100 group-hover:from-black transition-opacity duration-500"></div>

            <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="z-10 w-full relative">
              <span className="block text-lg font-bold text-white tracking-tight group-hover:text-orange-500 transition-colors leading-tight">
                {cat.name}
              </span>
              
              <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                  Explorar expertos
                </span>
                <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategorySlider;